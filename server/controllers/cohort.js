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
    .catch(() =>
      resp.status(400).send({ message: 'Cohort not saved. Please try again.' })
    );
};

const getCohortsMetaData = (req, resp) => {
  const {
    user: { _id: userId }
  } = req;

  Cohort.find({
    $or: [{ ownerIds: userId }, { memberIds: userId }],
    isArchived: false
  })
    .select('_id name description favIds memberIds ownerIds')
    .sort({ createdAt: -1 })
    .exec()
    .then(docs => {
      if (!docs) {
        return resp.status(404).send({ message: 'No cohorts data found.' });
      }

      return resp.status(200).send(responseWithCohorts(docs, userId));
    })
    .catch(() =>
      resp.status(400).send({
        message:
          'An error occurred while fetching the cohorts data. Please try again.'
      })
    );
};

const getArchivedCohortsMetaData = (req, resp) => {
  const {
    user: { _id: userId }
  } = req;

  Cohort.find(
    {
      $or: [{ ownerIds: userId }, { memberIds: userId }],
      isArchived: true
    },
    '_id name description favIds isArchived memberIds ownerIds',
    { sort: { created_at: -1 } }
  )
    .then(docs => {
      if (!docs) {
        return resp
          .status(400)
          .send({ message: 'No archived cohorts data found.' });
      }

      return resp.status(200).send(responseWithCohorts(docs, userId));
    })
    .catch(() =>
      resp.status(400).send({
        message:
          'An error occurred while fetching the archived cohorts data. Please try again.'
      })
    );
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
      _id: cohortId,
      ownerIds: userId
    },
    dataToUpdate
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Cohort  not found.' });
      }

      return resp
        .status(200)
        .send({ message: `Cohort "${doc.name}" successfully updated.` });
    })
    .catch(() =>
      resp.status(400).send({
        message:
          'An error occurred while updating the cohort. Please try again.'
      })
    );
};

const getCohortDetails = (req, resp) => {
  const {
    params: { id: cohortId },
    user: { _id: userId }
  } = req;

  if (!isValidMongoId(cohortId)) {
    return resp
      .status(404)
      .send({ message: `Data of cohort id: ${cohortId} not found.` });
  }

  Cohort.findOne({
    _id: cohortId,
    $or: [{ ownerIds: userId }, { memberIds: userId }]
  })
    .populate('memberIds', 'avatarUrl displayName _id')
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(404).send({
          message: `Data of cohort id: ${cohortId} not found.`
        });
      }

      const {
        ownerIds,
        _id,
        isArchived,
        description,
        name,
        memberIds: membersCollection
      } = doc;

      if (isArchived) {
        return resp.status(200).json({ _id, isArchived, name });
      }

      const isOwner = checkIfArrayContainsUserId(ownerIds, userId);
      const members = responseWithCohortMembers(membersCollection, ownerIds);

      resp.status(200).json({
        _id,
        isOwner,
        isArchived,
        description,
        name,
        members
      });
    })
    .catch(() =>
      resp.status(400).send({
        message:
          'An error occurred while fetching the cohort data. Please try again.'
      })
    );
};

const deleteCohortById = (req, resp) => {
  const {
    params: { id: cohortId },
    user: { _id: userId }
  } = req;
  let documentName = '';

  Cohort.findOne({ _id: cohortId, ownerIds: userId })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException(
          `Data of cohort id: ${cohortId} not found.`
        );
      }

      documentName = doc.name;
      return List.deleteMany({ cohortId }).exec();
    })
    .then(() => Cohort.deleteOne({ _id: cohortId }).exec())
    .then(() =>
      resp
        .status(200)
        .send({ message: `Cohort "${documentName}" successfully deleted.` })
    )
    .catch(err => {
      if (err instanceof NotFoundException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({
        message:
          'An error occurred while deleting the cohort. Please try again.'
      });
    });
};

const addToFavourites = (req, resp) => {
  const { id: cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  Cohort.findOneAndUpdate(
    {
      _id: cohortId,
      $or: [{ ownerIds: userId }, { memberIds: userId }]
    },
    {
      $push: { favIds: userId }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Cohort data not found.' });
      }

      return resp.status(200).send({
        message: `Cohort "${doc.name}" successfully marked as favourite.`
      });
    })
    .catch(() =>
      resp.status(400).send({
        message: "Can't mark cohort as favourite. Please try again."
      })
    );
};

const removeFromFavourites = (req, resp) => {
  const { id: cohortId } = req.params;
  const {
    user: { _id: userId }
  } = req;

  Cohort.findOneAndUpdate(
    {
      _id: cohortId,
      $or: [{ ownerIds: userId }, { memberIds: userId }]
    },
    {
      $pull: { favIds: userId }
    }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        resp.status(400).send({ message: 'Cohort data not found.' });
      }
      return resp.status(200).send({
        message: `Cohort "${doc.name}" successfully removed from favourites.`
      });
    })
    .catch(() =>
      resp.status(400).send({
        message: "Can't remove cohort from favourites. Please try again."
      })
    );
};

const removeOwner = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.findOneAndUpdate(
    {
      _id: cohortId,
      ownerIds: { $all: [currentUserId, sanitizedUserId] },
      memberIds: { $all: [currentUserId, sanitizedUserId] }
    },
    { $pull: { ownerIds: userId, memberIds: userId } }
  )
    .then(doc => {
      if (!doc) {
        return resp.status(404).send({ message: 'Cohort data not found.' });
      }

      return List.updateMany(
        {
          cohortId,
          isPrivate: false,
          memberIds: { $nin: [sanitizedUserId] },
          ownerIds: { $nin: [sanitizedUserId] },
          viewersIds: { $in: [sanitizedUserId] }
        },
        { $pull: { viewersIds: userId } }
      ).exec();
    })
    .then(() =>
      resp.status(200).send({
        message: 'Owner successfully removed from cohort.'
      })
    )
    .catch(() =>
      resp.status(400).send({ message: "Can't remove owner from cohort." })
    );
};

const removeMember = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.findOneAndUpdate(
    { _id: cohortId, ownerIds: currentUserId, memberIds: sanitizedUserId },
    { $pull: { memberIds: userId } }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(404).send({ message: 'Cohort data not found.' });
      }

      const { _id: cohortId } = doc;

      return List.updateMany(
        {
          cohortId,
          isPrivate: false,
          viewersIds: { $in: [sanitizedUserId] },
          memberIds: { $nin: [sanitizedUserId] },
          ownerIds: { $nin: [sanitizedUserId] }
        },
        { $pull: { viewersIds: userId } }
      ).exec();
    })
    .then(() =>
      resp.status(200).send({
        message: 'Member successfully removed from cohort.'
      })
    )
    .catch(() =>
      resp.status(400).send({
        message: "Can't remove member from cohort."
      })
    );
};

const changeToOwner = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;

  Cohort.findOneAndUpdate(
    { _id: cohortId, ownerIds: ownerId, memberIds: sanitize(userId) },
    { $push: { ownerIds: userId } }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Cohort data not found.' });
      }

      return resp.status(200).send({
        message: "User has been successfully set as a cohort's owner."
      });
    })
    .catch(() =>
      resp.status(400).send({
        message: "Can't set user as a cohort's owner."
      })
    );
};

const changeToMember = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const sanitizedUserId = sanitize(userId);
  const {
    user: { _id: ownerId }
  } = req;

  Cohort.findOneAndUpdate(
    { _id: cohortId, ownerIds: { $all: [ownerId, sanitizedUserId] } },
    { $pull: { ownerIds: userId } }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(400).send({ message: 'Cohort data not found.' });
      }

      return resp.status(200).send({
        message: "User has been successfully set as a cohort's member."
      });
    })
    .catch(() =>
      resp.status(400).send({
        message: "Can't set user as a cohort's member."
      })
    );
};

const addMember = (req, resp) => {
  const {
    user: { _id: currentUser }
  } = req;
  const { id: cohortId } = req.params;
  const { email } = req.body;
  let currentCohort;
  let newMember;

  Cohort.findOne({ _id: cohortId, $or: [{ ownerIds: currentUser }] })
    .exec()
    .then(cohort => {
      if (!cohort) {
        throw new BadRequestException(
          "You don't have permission to add new member."
        );
      }

      currentCohort = cohort;
      return User.findOne({ email }).exec();
    })
    .then(user => {
      const { _id: newMemberId, avatarUrl, displayName } = user;

      if (checkIfCohortMember(currentCohort, newMemberId)) {
        throw new BadRequestException('User is already a member.');
      }

      currentCohort.memberIds.push(newMemberId);
      newMember = { avatarUrl, newMemberId, displayName };

      return currentCohort.save();
    })
    .then(() => {
      const { _id: cohortId } = currentCohort;
      const { newMemberId } = newMember;

      return List.updateMany(
        { cohortId, isPrivate: false, viewersIds: { $nin: [newMemberId] } },
        { $push: { viewersIds: newMemberId } }
      ).exec();
    })
    .then(() => {
      const { ownerIds } = currentCohort;

      return resp
        .status(200)
        .json(responseWithCohortMember(newMember, ownerIds));
    })
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({
        message: 'An error occurred while adding new member. Please try again.'
      });
    });
};

module.exports = {
  addMember,
  addToFavourites,
  changeToMember,
  changeToOwner,
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  removeFromFavourites,
  removeMember,
  removeOwner,
  updateCohortById
};
