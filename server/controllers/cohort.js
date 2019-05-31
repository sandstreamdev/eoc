const sanitize = require('mongo-sanitize');

const Cohort = require('../models/cohort.model');
const {
  checkIfArrayContainsUserId,
  filter,
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
const { ListType, DEMO_MODE_ID } = require('../common/variables');
const Comment = require('../models/comment.model');

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
    .then(doc =>
      resp
        .location(`/cohorts/${doc._id}`)
        .status(201)
        .send(responseWithCohort(doc, userId))
    )
    .catch(() => resp.status(400).send());
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
        return resp.status(400).send();
      }

      return resp.status(200).send(responseWithCohorts(docs));
    })
    .catch(() => resp.status(400).send());
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
        return resp.status(400).send();
      }

      return resp.status(200).send(responseWithCohorts(docs));
    })
    .catch(() => resp.status(400).send());
};

const updateCohortById = (req, resp) => {
  const { description, isArchived, name } = req.body;
  const { id: cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
    name
  });

  Cohort.findOneAndUpdate(
    {
      _id: sanitize(cohortId),
      ownerIds: userId
    },
    dataToUpdate
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send();
      }

      return resp.status(200).send();
    })
    .catch(() => resp.status(400).send());
};

const getCohortDetails = (req, resp) => {
  const {
    params: { id: cohortId },
    user: { _id: userId }
  } = req;

  if (!isValidMongoId(cohortId)) {
    return resp.status(404).send();
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
        throw new NotFoundException();
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
        return resp.status(200).json({ _id, isArchived, name });
      }

      const isOwner = checkIfArrayContainsUserId(ownerIds, userId);
      const members = responseWithCohortMembers(membersCollection, ownerIds);

      resp.status(200).json({
        _id,
        description,
        isArchived,
        isMember: true,
        isOwner,
        members,
        name
      });
    })
    .catch(err => {
      if (err instanceof NotFoundException) {
        return resp.status(404).send();
      }

      resp.status(400).send();
    });
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
    .then(() => resp.status(200).send())
    .catch(err => {
      if (err instanceof NotFoundException) {
        const { status } = err;

        return resp.status(status).send();
      }

      resp.status(400).send();
    });
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
    .then(() => resp.status(200).send())
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status } = err;

        return resp.status(status).send();
      }

      resp.status(400).send();
    });
};

const addOwnerRole = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: currentUserId }
  } = req;

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
        return resp.status(400).send();
      }

      return resp.status(200).send();
    })
    .catch(() => resp.status(400).send());
};

const removeOwnerRole = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.findOne({
    _id: sanitize(cohortId),
    ownerIds: { $all: [currentUserId, sanitizedUserId] }
  })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException();
      }

      const { name, ownerIds } = doc;

      if (ownerIds.length < 2) {
        throw new BadRequestException(
          `You can not remove the owner role from yourself because you are the only owner in the "${name}" cohort.`
        );
      }

      ownerIds.splice(doc.ownerIds.indexOf(userId), 1);

      return doc.save();
    })
    .then(() =>
      resp.status(200).send({
        message: 'User has no owner role.'
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status } = err;

        return resp.status(status).send();
      }

      resp.status(400).send();
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
      .send({ message: 'Adding members is disabled in demo mode.' });
  }

  Cohort.findOne({ _id: sanitizedCohortId, ownerIds: userId })
    .exec()
    .then(cohort => {
      if (!cohort) {
        throw new BadRequestException(
          "You don't have permission to add new member."
        );
      }

      currentCohort = cohort;
      return User.findOne({ email: sanitize(email) }).exec();
    })
    .then(user => {
      if (!user) {
        return;
      }

      if (user.idFromProvider === DEMO_MODE_ID) {
        throw new BadRequestException(`There is no user of email: ${email}`);
      }

      const { _id, avatarUrl, displayName } = user;

      if (checkIfCohortMember(currentCohort, _id)) {
        throw new BadRequestException('User is already a member.');
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

        return resp
          .status(200)
          .json(responseWithCohortMember(newMember, ownerIds));
      }

      resp.status(204).send();
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send();
    });
};

module.exports = {
  addMember,
  addOwnerRole,
  removeOwnerRole,
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  removeMember,
  updateCohortById
};
