const sanitize = require('mongo-sanitize');

const Cohort = require('../models/cohort.model');
const {
  filter,
  isMember,
  isOwner,
  isValidMongoId,
  responseWithCohort,
  responseWithCohorts
} = require('../common/utils');
const List = require('../models/list.model');
const NotFoundException = require('../common/exceptions/NotFoundException');
const BadRequestException = require('../common/exceptions/BadRequestException');
const User = require('../models/user.model');
const {
  checkIfCohortMember,
  responseWithCohortMember,
  responseWithCohortMembers
} = require('../common/utils/index');
const { ActivityType, ListType, DEMO_MODE_ID } = require('../common/variables');
const Comment = require('../models/comment.model');
const { saveActivity } = require('./activity');

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
    .select('_id name description memberIds ownerIds')
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
      ownerIds: userId,
      isArchived: true
    },
    '_id name description isArchived memberIds ownerIds',
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

      resp.send();

      if (description !== undefined) {
        const { description: prevDescription } = doc;
        if (!description && prevDescription) {
          cohortActivity = ActivityType.COHORT_REMOVE_DESCRIPTION;
        } else if (description && !prevDescription) {
          cohortActivity = ActivityType.COHORT_ADD_DESCRIPTION;
        } else {
          cohortActivity = ActivityType.COHORT_EDIT_DESCRIPTION;
        }
      }

      if (name) {
        cohortActivity = ActivityType.COHORT_EDIT_NAME;
      }

      if (isArchived !== undefined) {
        cohortActivity = isArchived
          ? ActivityType.COHORT_ARCHIVE
          : ActivityType.COHORT_RESTORE;
      }

      saveActivity(
        cohortActivity,
        userId,
        null,
        null,
        sanitizedCohortId,
        null,
        doc.name
      );
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
    memberIds: userId
  })
    .populate('memberIds', 'avatarUrl displayName _id')
    .lean()
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(404);
      }

      const {
        _id,
        description,
        isArchived,
        memberIds: membersCollection,
        name,
        ownerIds
      } = doc;

      if (isArchived) {
        return resp.send({ _id, isArchived, name });
      }

      const members = responseWithCohortMembers(membersCollection, ownerIds);

      resp.send({
        _id,
        description,
        isArchived,
        isMember: true,
        isOwner: isOwner(doc, userId),
        members,
        name
      });
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

  Cohort.findOne({ _id: sanitizedCohortId, ownerIds: userId })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException();
      }

      return List.find({ cohortId: sanitizedCohortId }, '_id')
        .lean()
        .exec();
    })
    .then(lists => {
      if (lists) {
        const listsIds = lists.map(lists => lists._id);

        return Comment.deleteMany({ listId: { $in: listsIds } });
      }
    })
    .then(() => List.deleteMany({ cohortId: sanitizedCohortId }).exec())
    .then(() => Cohort.deleteOne({ _id: sanitizedCohortId }).exec())
    .then(doc => {
      if (!doc) {
        return resp.sendStatus(400);
      }

      resp.send();

      saveActivity(
        ActivityType.COHORT_DELETE,
        userId,
        null,
        null,
        cohortId,
        doc.name
      );
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
      resp.send();

      saveActivity(
        ActivityType.COHORT_REMOVE_USER,
        currentUserId,
        null,
        null,
        sanitizedCohortId,
        sanitizedUserId
      );
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

      resp.send();

      saveActivity(
        ActivityType.COHORT_SET_AS_OWNER,
        currentUserId,
        null,
        null,
        sanitizedCohortId,
        sanitizedUserId
      );
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
      resp.send();

      saveActivity(
        ActivityType.COHORT_SET_AS_MEMBER,
        currentUserId,
        null,
        null,
        sanitizedCohortId,
        sanitizedUserId
      );
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
  let newMember;
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
      if (!user) {
        return;
      }

      if (user.idFromProvider === DEMO_MODE_ID) {
        throw new BadRequestException(
          'cohort.actions.add-member-no-user-of-email'
        );
      }

      const { _id, avatarUrl, displayName } = user;

      if (checkIfCohortMember(currentCohort, _id)) {
        throw new BadRequestException(
          'cohort.actions.add-member-already-member'
        );
      }

      currentCohort.memberIds.push(_id);
      newMember = { avatarUrl, _id, displayName };

      return currentCohort.save();
    })
    .then(() => {
      if (newMember) {
        const { _id: newMemberId } = newMember;

        return List.updateMany(
          {
            cohortId: sanitizedCohortId,
            type: ListType.SHARED,
            viewersIds: { $nin: [newMemberId] }
          },
          { $push: { viewersIds: newMemberId } }
        ).exec();
      }
    })
    .then(() => {
      if (newMember) {
        const { ownerIds } = currentCohort;

        resp.send(responseWithCohortMember(newMember, ownerIds));

        return saveActivity(
          ActivityType.COHORT_ADD_USER,
          userId,
          null,
          null,
          sanitizedCohortId,
          newMember._id
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

      if (isOwner(doc, userId)) {
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
    .then(() => resp.send())
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
