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
const io = require('../sockets/index');
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

      const activity = {
        activityType: ActivityType.COHORT_ADD,
        cohortId: doc._id,
        performerId: userId
      };

      fireAndForget(saveActivity(activity));
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

      return resp.send(responseWithCohorts(docs, currentUserId));
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
    '_id name createdAt description isArchived memberIds ownerIds'
  )
    .lean()
    .exec()
    .then(docs => {
      if (!docs) {
        return resp.sendStatus(400);
      }

      return resp.send(responseWithCohorts(docs, userId));
    })
    .catch(() => resp.sendStatus(400));
};

const archiveCohort = async (req, resp) => {
  const { id: cohortId } = req.params;
  const {
    user: { _id: userId, displayName }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);

  try {
    const cohort = await Cohort.findOneAndUpdate(
      {
        _id: sanitizedCohortId,
        isArchived: false,
        ownerIds: userId
      },
      { isArchived: true }
    ).exec();

    const activity = {
      activityType: ActivityType.COHORT_ARCHIVE,
      cohortId: sanitizedCohortId,
      editedValue: cohort.name,
      performerId: userId
    };

    fireAndForget(saveActivity(activity));

    const socketInstance = io.getInstance();
    const data = {
      cohortId: sanitizedCohortId,
      performer: displayName
    };

    resp.send();
    fireAndForget(socketActions.archiveCohort(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
};

const restoreCohort = async (req, resp) => {
  const { id: cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);
  const socketInstance = io.getInstance();

  try {
    const cohort = await Cohort.findOneAndUpdate(
      {
        _id: sanitizedCohortId,
        isArchived: true,
        isDeleted: false,
        ownerIds: userId
      },
      { isArchived: false },
      { new: true }
    )
      .populate('memberIds', 'avatarUrl displayName _id')
      .lean()
      .exec();

    const activity = {
      activityType: ActivityType.COHORT_RESTORE,
      cohortId: sanitizedCohortId,
      editedValue: cohort.name,
      performerId: userId
    };
    const data = { cohort, cohortId };

    fireAndForget(saveActivity(activity));

    resp.send();
    fireAndForget(socketActions.restoreCohort(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
};

const updateCohort = async (req, resp) => {
  const { description, name } = req.body;
  const { id: cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);
  const dataToUpdate = filter(x => x !== undefined)({
    description,
    name
  });

  if (name !== undefined && !validator.isLength(name, { min: 1, max: 32 })) {
    return resp.sendStatus(400);
  }

  try {
    const cohort = await Cohort.findOneAndUpdate(
      {
        _id: sanitizedCohortId,
        isArchived: false,
        ownerIds: userId
      },
      dataToUpdate
    ).exec();
    const socketInstance = io.getInstance();
    const data = { cohortId };
    let cohortActivity;

    if (isDefined(description)) {
      const { description: prevDescription } = cohort;
      if (!description && prevDescription) {
        cohortActivity = ActivityType.COHORT_REMOVE_DESCRIPTION;
      } else if (description && !prevDescription) {
        cohortActivity = ActivityType.COHORT_ADD_DESCRIPTION;
      } else {
        cohortActivity = ActivityType.COHORT_EDIT_DESCRIPTION;
      }

      data.description = description;
    }

    if (name) {
      cohortActivity = ActivityType.COHORT_EDIT_NAME;
      data.name = name;
    }

    const activity = {
      activityType: cohortActivity,
      cohortId: sanitizedCohortId,
      editedValue: cohort.name,
      performerId: userId
    };

    fireAndForget(saveActivity(activity));

    resp.send();
    fireAndForget(socketActions.updateCohort(socketInstance)(data));
  } catch {
    resp.sendStatus(400);
  }
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

const deleteCohort = (req, resp) => {
  const {
    params: { id: cohortId },
    user: { _id: userId, displayName }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);
  let cohort;

  Cohort.findOne({ _id: sanitizedCohortId, isArchived: true, ownerIds: userId })
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
      const { memberIds, name } = cohort;
      const data = { cohortId, memberIds, performer: displayName };
      const socketInstance = io.getInstance();
      const activity = {
        activityType: ActivityType.COHORT_DELETE,
        cohortId,
        editedValue: name,
        performerId: userId
      };

      fireAndForget(socketActions.deleteCohort(socketInstance)(data));

      fireAndForget(saveActivity(activity));

      resp.send();
    })
    .catch(err =>
      resp.sendStatus(err instanceof NotFoundException ? 404 : 400)
    );
};

const removeMember = async (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const sanitizedCohortId = sanitize(cohortId);
  const {
    user: { _id: currentUserId, displayName }
  } = req;

  try {
    const cohort = await Cohort.findOneAndUpdate(
      {
        _id: sanitizedCohortId,
        isArchived: false,
        ownerIds: currentUserId,
        memberIds: sanitizedUserId
      },
      { $pull: { memberIds: userId, ownerIds: userId } },
      { new: true }
    )
      .lean()
      .exec();

    await List.updateMany(
      {
        cohortId: sanitizedCohortId,
        type: ListType.SHARED,
        viewersIds: { $in: [userId] },
        memberIds: { $nin: [userId] },
        ownerIds: { $nin: [userId] }
      },
      { $pull: { viewersIds: userId } }
    ).exec();

    const activity = {
      activityType: ActivityType.COHORT_REMOVE_USER,
      cohortId: sanitizedCohortId,
      editedUserId: sanitizedUserId,
      performerId: currentUserId
    };

    fireAndForget(saveActivity(activity));

    const socketInstance = io.getInstance();
    const membersCount = cohort.memberIds.length;
    const data = {
      cohortId: sanitizedCohortId,
      membersCount,
      performer: displayName,
      userId: sanitizedUserId
    };

    resp.send();
    fireAndForget(socketActions.removeMember(socketInstance)(data));
  } catch (err) {
    resp.sendStatus(400);
  }
};

const addOwnerRole = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: currentUserId, displayName }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);

  Cohort.findOneAndUpdate(
    {
      _id: sanitize(cohortId),
      isArchived: false,
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

      const socketInstance = io.getInstance();

      const data = {
        cohortId: sanitizedCohortId,
        notificationData: {
          cohortName: doc.name,
          performer: displayName,
          performerId: currentUserId
        },
        userId: sanitizedUserId
      };

      fireAndForget(socketActions.addOwnerRole(socketInstance)(data));

      const activity = {
        activityType: ActivityType.COHORT_SET_AS_OWNER,
        cohortId: sanitizedCohortId,
        editedUserId: sanitizedUserId,
        performerId: currentUserId
      };

      fireAndForget(saveActivity(activity));

      resp.send();
    })
    .catch(() => resp.sendStatus(400));
};

const removeOwnerRole = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: currentUserId, displayName }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);

  Cohort.findOne({
    _id: sanitizedCohortId,
    isArchived: false,
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
    .then(doc => {
      const socketInstance = io.getInstance();

      const data = {
        cohortId: sanitizedCohortId,
        notificationData: {
          cohortName: doc.name,
          performer: displayName,
          performerId: currentUserId
        },
        userId: sanitizedUserId
      };

      fireAndForget(socketActions.removeOwnerRole(socketInstance)(data));

      const activity = {
        activityType: ActivityType.COHORT_SET_AS_MEMBER,
        cohortId: sanitizedCohortId,
        editedUserId: sanitizedUserId,
        performerId: currentUserId
      };

      fireAndForget(saveActivity(activity));

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

const addMember = async (req, resp) => {
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

  Cohort.findOne({
    _id: sanitizedCohortId,
    isArchived: false,
    ownerIds: userId
  })
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
        const socketInstance = io.getInstance();

        return returnPayload(
          socketActions.addMember(socketInstance)({
            cohortId,
            member: userToSend
          })
        )(userToSend);
      }
    })
    .then(userToSend => {
      if (userToSend) {
        resp.send(userToSend);

        const activity = {
          activityType: ActivityType.COHORT_ADD_USER,
          cohortId: sanitizedCohortId,
          editedUserId: userToSend._id,
          performerId: userId
        };

        return fireAndForget(saveActivity(activity));
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

const leaveCohort = async (req, resp) => {
  const { id: cohortId } = req.params;
  const {
    user: { _id: userId, displayName }
  } = req;
  const sanitizedCohortId = sanitize(cohortId);

  try {
    const cohort = await Cohort.findOne({
      _id: sanitizedCohortId,
      isArchived: false,
      memberIds: { $in: [userId] }
    }).exec();
    const { memberIds, ownerIds } = cohort;
    const isOwner = isCohortOwner(cohort, userId);

    if (isOwner) {
      if (ownerIds.length === 1) {
        throw new BadRequestException(
          'cohort.actions.leave-cohort-only-one-owner'
        );
      }
      ownerIds.splice(cohort.ownerIds.indexOf(userId), 1);
    }

    if (isMember(cohort, userId)) {
      memberIds.splice(cohort.memberIds.indexOf(userId), 1);
    }

    const savedCohort = await cohort.save();

    await List.updateMany(
      {
        cohortId: sanitizedCohortId,
        type: ListType.SHARED,
        viewersIds: { $in: [userId] },
        memberIds: { $nin: [userId] },
        ownerIds: { $nin: [userId] }
      },
      { $pull: { viewersIds: userId } }
    ).exec();

    const socketInstance = io.getInstance();
    const data = {
      cohortId: sanitizedCohortId,
      membersCount: savedCohort.memberIds.length,
      performer: displayName,
      userId
    };

    resp.send();
    fireAndForget(socketActions.leaveCohort(socketInstance)(data));
  } catch (err) {
    if (err instanceof BadRequestException) {
      const { message } = err;

      return resp.status(400).send({ message });
    }

    resp.sendStatus(400);
  }
};

module.exports = {
  addMember,
  addOwnerRole,
  archiveCohort,
  createCohort,
  deleteCohort,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  leaveCohort,
  removeMember,
  removeOwnerRole,
  restoreCohort,
  updateCohort
};
