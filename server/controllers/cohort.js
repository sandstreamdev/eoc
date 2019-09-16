const sanitize = require('mongo-sanitize');
const validator = require('validator');

const Cohort = require('../models/cohort.model');
const {
  filter,
  fireAndForget,
  isDefined,
  isMember,
  isOwner: isCohortOwner,
  isValidMongoId,
  responseWithCohort,
  responseWithCohortDetails,
  responseWithCohorts,
  returnPayload
} = require('../common/utils');
const List = require('../models/list.model');
const NotFoundException = require('../common/exceptions/NotFoundException');
const BadRequestException = require('../common/exceptions/BadRequestException');
const User = require('../models/user.model');
const {
  checkIfCohortMember,
  responseWithCohortMember
} = require('../common/utils/index');
const { ActivityType, ListType, DEMO_MODE_ID } = require('../common/variables');
const Comment = require('../models/comment.model');
const { saveActivity } = require('./activity');
const allCohortsViewClients = require('../sockets/index').getAllCohortsViewClients();
const cohortClients = require('../sockets/index').getCohortViewClients();
const dashboardClients = require('../sockets/index').getDashboardViewClients();
const listClients = require('../sockets/index').getListViewClients();
const socketInstance = require('../sockets/index').getSocketInstance();
const socketActions = require('../sockets/cohort');

const createCohort = (req, resp) => {
  const { description, name, userId } = req.body;
  const cohort = new Cohort({
    description,
    memberIds: userId,
    name,
    ownerIds: userId
  });

  cohort
    .save()
    .then(doc => {
      resp
        .location(`/cohorts/${doc._id}`)
        .status(201)
        .send(responseWithCohort(doc, userId));

      saveActivity(ActivityType.COHORT_ADD, userId, null, null, doc._id);
    })
    .catch(() => resp.sendStatus(400));
};

const getCohortsMetaData = (req, resp) => {
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.find({ memberIds: currentUserId, isArchived: false })
    .select('_id createdAt description memberIds name ownerIds')
    .sort({ createdAt: -1 })
    .lean()
    .exec()
    .then(docs => {
      if (!docs) {
        return resp.sendStatus(400);
      }

      return resp.send(responseWithCohorts(docs));
    })
    .catch(() => resp.sendStatus(400));
};

const getArchivedCohortsMetaData = (req, resp) => {
  const {
    user: { _id: userId }
  } = req;

  Cohort.find(
    {
      isArchived: true,
      isDeleted: false,
      ownerIds: userId
    },
    '_id name createdAt description isArchived memberIds ownerIds',
    { sort: { created_at: -1 } }
  )
    .lean()
    .exec()
    .then(docs => {
      if (!docs) {
        return resp.sendStatus(400);
      }

      return resp.send(responseWithCohorts(docs));
    })
    .catch(() => resp.sendStatus(400));
};

const updateCohortById = (req, resp) => {
  const { description, isArchived, name } = req.body;
  const { id: cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);
  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
    name
  });
  let cohortActivity;

  if (name !== undefined && !validator.isLength(name, { min: 1, max: 32 })) {
    return resp.sendStatus(400);
  }

  Cohort.findOneAndUpdate(
    {
      _id: sanitizedCohortId,
      ownerIds: userId
    },
    dataToUpdate
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      const data = { cohortId, description, performerId: userId };

      if (isDefined(description)) {
        const { description: prevDescription } = doc;
        if (!description && prevDescription) {
          cohortActivity = ActivityType.COHORT_REMOVE_DESCRIPTION;
        } else if (description && !prevDescription) {
          cohortActivity = ActivityType.COHORT_ADD_DESCRIPTION;
        } else {
          cohortActivity = ActivityType.COHORT_EDIT_DESCRIPTION;
        }

        data.description = description;

        return returnPayload(
          socketActions.updateCohort(socketInstance, allCohortsViewClients)(
            data
          )
        )(doc);
      }

      if (name) {
        cohortActivity = ActivityType.COHORT_EDIT_NAME;

        data.name = name;

        return returnPayload(
          socketActions.updateCohort(socketInstance, allCohortsViewClients)(
            data
          )
        )(doc);
      }

      if (isDefined(isArchived)) {
        if (isArchived) {
          cohortActivity = ActivityType.COHORT_ARCHIVE;

          return returnPayload(
            socketActions.archiveCohort(
              socketInstance,
              allCohortsViewClients,
              dashboardClients
            )(data)
          )(doc);
        }

        cohortActivity = ActivityType.COHORT_RESTORE;

        return returnPayload(
          socketActions.restoreCohort(
            socketInstance,
            allCohortsViewClients,
            cohortClients,
            dashboardClients
          )(data)
        )(doc);
      }
    })
    .then(doc => {
      fireAndForget(
        saveActivity(
          cohortActivity,
          userId,
          null,
          null,
          sanitizedCohortId,
          null,
          doc.name
        )
      );

      return resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const getCohortDetails = (req, resp) => {
  const {
    params: { id: cohortId },
    user: { _id: userId }
  } = req;

  if (!isValidMongoId(cohortId)) {
    return resp.sendStatus(404);
  }

  Cohort.findOne({
    _id: sanitize(cohortId),
    isDeleted: false,
    memberIds: userId
  })
    .populate('memberIds', 'avatarUrl displayName _id')
    .lean()
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(404);
      }

      const { _id, isArchived, name } = doc;

      const isOwner = isCohortOwner(doc, userId);

      if (isArchived) {
        if (!isOwner) {
          return resp.sendStatus(404);
        }

        return resp.send({ _id, isArchived, isOwner, name });
      }

      resp.send(responseWithCohortDetails(doc, userId));
    })
    .catch(err =>
      resp.sendStatus(err instanceof NotFoundException ? 404 : 400)
    );
};

const deleteCohortById = (req, resp) => {
  const {
    params: { id: cohortId },
    user: { _id: userId }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);
  let cohort;

  Cohort.findOne({ _id: sanitizedCohortId, ownerIds: userId })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException();
      }

      cohort = doc;

      return List.find({ cohortId: sanitizedCohortId }, '_id')
        .lean()
        .exec();
    })
    .then(lists => {
      if (lists) {
        const listsIds = lists.map(lists => lists._id);

        return Comment.updateMany(
          { listId: { $in: listsIds } },
          { isDeleted: true }
        );
      }
    })
    .then(() =>
      List.updateMany(
        { cohortId: sanitizedCohortId },
        { isDeleted: true }
      ).exec()
    )
    .then(() =>
      Cohort.updateMany({ _id: sanitizedCohortId }, { isDeleted: true }).exec()
    )
    .then(() => {
      const { ownerIds: owners, name } = cohort;
      const data = { cohortId, owners };

      socketActions.deleteCohort(socketInstance, allCohortsViewClients)(data);

      fireAndForget(
        saveActivity(
          ActivityType.COHORT_DELETE,
          userId,
          null,
          null,
          cohortId,
          null,
          name
        )
      );

      resp.send();
    })
    .catch(err =>
      resp.sendStatus(err instanceof NotFoundException ? 404 : 400)
    );
};

const removeMember = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const sanitizedCohortId = sanitize(cohortId);
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.findOneAndUpdate(
    {
      _id: sanitizedCohortId,
      ownerIds: currentUserId,
      memberIds: sanitizedUserId
    },
    { $pull: { memberIds: userId, ownerIds: userId } }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }

      return List.updateMany(
        {
          cohortId: sanitizedCohortId,
          type: ListType.SHARED,
          viewersIds: { $in: [userId] },
          memberIds: { $nin: [userId] },
          ownerIds: { $nin: [userId] }
        },
        { $pull: { viewersIds: userId } }
      ).exec();
    })
    .then(() => {
      socketActions.removeMember(
        socketInstance,
        allCohortsViewClients,
        cohortClients,
        dashboardClients,
        listClients
      )({ cohortId: sanitizedCohortId, userId: sanitizedUserId });

      fireAndForget(
        saveActivity(
          ActivityType.COHORT_REMOVE_USER,
          currentUserId,
          null,
          null,
          sanitizedCohortId,
          sanitizedUserId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const addOwnerRole = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);

  Cohort.findOneAndUpdate(
    {
      _id: sanitize(cohortId),
      ownerIds: { $in: [currentUserId], $nin: [sanitizedUserId] },
      memberIds: sanitizedUserId
    },
    { $push: { ownerIds: userId } }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      socketActions.addOwnerRole(socketInstance, cohortClients)({
        cohortId: sanitizedCohortId,
        userId: sanitizedUserId
      });

      fireAndForget(
        saveActivity(
          ActivityType.COHORT_SET_AS_OWNER,
          currentUserId,
          null,
          null,
          sanitizedCohortId,
          sanitizedUserId
        )
      );

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const removeOwnerRole = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: currentUserId }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);

  Cohort.findOne({
    _id: sanitizedCohortId,
    ownerIds: { $all: [currentUserId, sanitizedUserId] }
  })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }

      const { ownerIds } = doc;

      if (ownerIds.length < 2) {
        throw new BadRequestException('cohort.actions.remove-owner-fail-1');
      }

      ownerIds.splice(doc.ownerIds.indexOf(userId), 1);

      return doc.save();
    })
    .then(() => {
      socketActions.removeOwnerRole(socketInstance, cohortClients)({
        cohortId: sanitizedCohortId,
        userId: sanitizedUserId
      });

      fireAndForget(
        saveActivity(
          ActivityType.COHORT_SET_AS_MEMBER,
          currentUserId,
          null,
          null,
          sanitizedCohortId,
          sanitizedUserId
        )
      );

      resp.send();
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        return resp.status(400).send({ message });
      }

      resp.sendStatus(400);
    });
};

const addMember = (req, resp) => {
  const {
    user: { _id: userId, idFromProvider }
  } = req;
  const { id: cohortId } = req.params;
  const { email } = req.body;
  let currentCohort;
  const sanitizedCohortId = sanitize(cohortId);

  if (idFromProvider === DEMO_MODE_ID) {
    return resp
      .status(401)
      .send({ message: 'cohort.actions.add-member-demo-msg' });
  }

  if (!email) {
    return resp.status(400).send({ message: 'Email can not be empty.' });
  }

  Cohort.findOne({ _id: sanitizedCohortId, ownerIds: userId })
    .exec()
    .then(cohort => {
      if (!cohort) {
        throw new BadRequestException();
      }

      currentCohort = cohort;

      return User.findOne({ email: sanitize(email) }).exec();
    })
    .then(user => {
      if (!user || (!user.idFromProvider && !user.isActive)) {
        return;
      }

      if (user.idFromProvider === DEMO_MODE_ID) {
        throw new BadRequestException(
          'cohort.actions.add-member-no-user-of-email'
        );
      }

      const { _id: itemId } = user;

      if (checkIfCohortMember(currentCohort, itemId)) {
        throw new BadRequestException(
          'cohort.actions.add-member-already-member'
        );
      }
      currentCohort.memberIds.push(itemId);

      return returnPayload(currentCohort.save())(user);
    })
    .then(user => {
      if (user) {
        const { _id: newMemberId } = user;

        return returnPayload(
          List.updateMany(
            {
              cohortId: sanitizedCohortId,
              type: ListType.SHARED,
              viewersIds: { $nin: [newMemberId] }
            },
            { $push: { viewersIds: newMemberId } }
          ).exec()
        )(user);
      }
    })
    .then(user => {
      if (user) {
        const { ownerIds } = currentCohort;
        const userToSend = responseWithCohortMember(user, ownerIds);

        return returnPayload(
          socketActions.addMember(
            socketInstance,
            allCohortsViewClients,
            dashboardClients
          )({
            cohortId,
            member: userToSend
          })
        )(userToSend);
      }
    })
    .then(userToSend => {
      if (userToSend) {
        resp.send(userToSend);

        return fireAndForget(
          saveActivity(
            ActivityType.COHORT_ADD_USER,
            userId,
            null,
            null,
            sanitizedCohortId,
            userToSend._id
          )
        );
      }
      resp.send({ _id: null });
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        return resp.status(400).send({ message });
      }

      resp.sendStatus(400);
    });
};

const leaveCohort = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const sanitizedCohortId = sanitize(cohortId);

  Cohort.findOne({
    _id: sanitizedCohortId,
    memberIds: { $in: [sanitizedUserId] }
  })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }

      const { memberIds, ownerIds } = doc;
      const isOwner = isCohortOwner(doc, userId);

      if (isOwner) {
        if (ownerIds.length === 1) {
          throw new BadRequestException(
            'cohort.actions.leave-cohort-only-one-owner'
          );
        }
        ownerIds.splice(doc.ownerIds.indexOf(userId), 1);
      }

      if (isMember(doc, userId)) {
        memberIds.splice(doc.memberIds.indexOf(userId), 1);
      }

      return doc.save();
    })
    .then(() =>
      List.updateMany(
        {
          cohortId: sanitizedCohortId,
          type: ListType.SHARED,
          viewersIds: { $in: [userId] },
          memberIds: { $nin: [userId] },
          ownerIds: { $nin: [userId] }
        },
        { $pull: { viewersIds: userId } }
      ).exec()
    )
    .then(() => {
      socketActions.leaveCohort(socketInstance, allCohortsViewClients)({
        cohortId: sanitizedCohortId,
        userId: sanitizedUserId
      });

      resp.send();
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { message } = err;

        return resp.status(400).send({ message });
      }

      resp.sendStatus(400);
    });
};

module.exports = {
  addMember,
  addOwnerRole,
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  leaveCohort,
  removeMember,
  removeOwnerRole,
  updateCohortById
};
