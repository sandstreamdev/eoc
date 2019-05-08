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

  cohort.save((err, doc) => {
    if (err) {
      return resp
        .status(400)
        .send({ message: 'Cohort not saved. Please try again.' });
    }

    resp
      .location(`/cohorts/${doc._id}`)
      .status(201)
      .send(responseWithCohort(doc, userId));
  });
};

const getCohortsMetaData = (req, resp) => {
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.find({ memberIds: currentUserId, isArchived: false })
    .select('_id name description favIds memberIds ownerIds')
    .sort({ createdAt: -1 })
    .exec()
    .then(docs =>
      docs
        ? resp.status(200).send(responseWithCohorts(docs, currentUserId))
        : resp.status(404).send({ message: 'No cohorts data found.' })
    )
    .catch(err =>
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
      ownerIds: userId,
      isArchived: true
    },
    '_id name description favIds isArchived memberIds ownerIds',
    { sort: { created_at: -1 } },
    (err, docs) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while fetching the archived cohorts data. Please try again.'
        });
      }

      if (!docs) {
        return resp
          .status(404)
          .send({ message: 'No archived cohorts data found.' });
      }

      resp.status(200).send(responseWithCohorts(docs, userId));
    }
  );
};

const updateCohortById = (req, resp) => {
  const { description, isArchived, name } = req.body;
  const { id } = req.params;
  const { _id: currentUserId } = req.user;

  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
    name
  });

  Cohort.findOneAndUpdate(
    {
      _id: id,
      ownerIds: currentUserId
    },
    dataToUpdate,
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while updating the cohort. Please try again.'
        });
      }

      doc
        ? resp
            .status(200)
            .send({ message: `Cohort "${doc.name}" successfully updated.` })
        : resp.status(404).send({ message: 'Cohort  not found.' });
    }
  );
};

const getCohortDetails = (req, resp) => {
  const {
    params: { id: cohortId },
    user: { _id: currentUserId }
  } = req;

  if (!isValidMongoId(cohortId)) {
    return resp
      .status(404)
      .send({ message: `Data of cohort id: ${cohortId} not found.` });
  }
  Cohort.findOne({ _id: cohortId, memberIds: currentUserId })
    .populate('memberIds', 'avatarUrl displayName _id')
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException(
          `Data of cohort id: ${cohortId} not found.`
        );
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

      const members = responseWithCohortMembers(membersCollection, ownerIds);
      const isOwner = checkIfArrayContainsUserId(ownerIds, currentUserId);

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
    .catch(() =>
      resp.status(400).send({
        message:
          'An error occurred while fetching the cohort data. Please try again.'
      })
    );
};

const deleteCohortById = (req, resp) => {
  const { id: cohortId } = req.params;
  const {
    user: { _id: currentUserId }
  } = req;
  let documentName = '';

  Cohort.findOne({ _id: cohortId, ownerIds: currentUserId })
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
    },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't mark cohort as favourite. Please try again."
        });
      }

      doc
        ? resp.status(200).send({
            message: `Cohort "${doc.name}" successfully marked as favourite.`
          })
        : resp.status(404).send({ message: 'Cohort data not found.' });
    }
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
    },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't remove cohort from favourites. Please try again."
        });
      }

      doc
        ? resp.status(200).send({
            message: `Cohort "${
              doc.name
            }" successfully removed from favourites.`
          })
        : resp.status(404).send({ message: 'Cohort data not found.' });
    }
  );
};

const removeMember = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;

  Cohort.findOneAndUpdate(
    { _id: cohortId, ownerIds: ownerId, memberIds: userId },
    { $pull: { memberIds: userId, ownerIds: userId } }
  )
    .exec()
    .then(doc => {
      if (!doc) {
        throw new BadRequestException(
          `Data of cohort id: ${cohortId} not found.`
        );
      }

      return List.updateMany(
        {
          cohortId,
          isPrivate: false,
          viewersIds: { $in: [userId] },
          memberIds: { $nin: [userId] },
          ownerIds: { $nin: [userId] }
        },
        { $pull: { viewersIds: userId } }
      ).exec();
    })
    .then(() =>
      resp.status(200).send({
        message: 'Member successfully removed from cohort.'
      })
    )
    .catch(err => {
      if (err instanceof BadRequestException) {
        const { status, message } = err;

        return resp.status(status).send({ message });
      }

      resp.status(400).send({
        message: "Can't remove member from cohort."
      });
    });
};

const addOwnerRole = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.findOneAndUpdate(
    {
      _id: cohortId,
      ownerIds: { $in: [currentUserId], $nin: [userId] },
      memberIds: userId
    },
    { $push: { ownerIds: userId } },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't set user as a cohort's owner."
        });
      }

      if (doc) {
        return resp.status(200).send({
          message: "User has been successfully set as a cohort's owner."
        });
      }

      resp.status(400).send({ message: 'Cohort data not found.' });
    }
  );
};

const removeOwnerRole = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.findOneAndUpdate(
    { _id: cohortId, ownerIds: { $all: [currentUserId, userId] } },
    { $pull: { ownerIds: userId } },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't remove owner role."
        });
      }

      if (!doc) {
        return resp.status(400).send({
          message: 'Cohort data not found.'
        });
      }

      resp.status(200).send({ message: 'User has no owner role.' });
    }
  );
};

const addMember = (req, resp) => {
  const {
    user: { _id: ownerId }
  } = req;
  const { id: cohortId } = req.params;
  const { email } = req.body;
  let currentCohort;
  let newMember;

  Cohort.findOne({ _id: cohortId, ownerIds: ownerId })
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
      if (!user) {
        throw new BadRequestException(`There is no user of email: ${email}`);
      }

      const { _id: newMemberId, avatarUrl, displayName } = user;

      if (checkIfCohortMember(currentCohort, newMemberId)) {
        throw new BadRequestException('User is already a member.');
      }

      currentCohort.memberIds.push(newMemberId);
      newMember = { avatarUrl, newMemberId, displayName };

      return currentCohort.save();
    })
    .then(() => {
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
  addOwnerRole,
  removeOwnerRole,
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  removeFromFavourites,
  removeMember,
  updateCohortById
};
