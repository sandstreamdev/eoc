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
    name,
    description,
    ownerIds: userId,
    memberIds: userId
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
    user: { _id: userId }
  } = req;

  Cohort.find({
    $or: [{ ownerIds: userId }, { memberIds: userId }],
    isArchived: false
  })
    .select('_id name description favIds memberIds ownerIds')
    .sort({ createdAt: -1 })
    .exec()
    .then(docs =>
      docs
        ? resp.status(200).send(responseWithCohorts(docs, userId))
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
      $or: [{ ownerIds: userId }, { memberIds: userId }],
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

  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
    name
  });

  Cohort.findOneAndUpdate(
    {
      _id: id,
      $or: [{ ownerIds: req.user._id }]
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
  if (!isValidMongoId(req.params.id)) {
    return resp
      .status(404)
      .send({ message: `Data of cohort id: ${req.params.id} not found.` });
  }

  Cohort.findOne({
    _id: req.params.id,
    $or: [{ ownerIds: req.user._id }, { memberIds: req.user._id }]
  })
    .populate('memberIds', 'avatarUrl displayName _id')
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(404).send({
          message: `Data of cohort id: ${req.params.id} not found.`
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

      const isOwner = checkIfArrayContainsUserId(ownerIds, req.user._id);
      const members = responseWithCohortMembers(
        [...membersCollection],
        ownerIds
      );

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
  let documentName = '';

  Cohort.findOne({ _id: req.params.id, ownerIds: req.user._id })
    .exec()
    .then(doc => {
      if (!doc) {
        throw new NotFoundException(
          `Data of cohort id: ${req.params.id} not found.`
        );
      }

      documentName = doc.name;
      return List.deleteMany({ cohortId: req.params.id }).exec();
    })
    .then(() => Cohort.deleteOne({ _id: req.params.id }).exec())
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

const removeOwner = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;

  Cohort.findOneAndUpdate(
    {
      _id: cohortId,
      ownerIds: { $all: [ownerId, userId] },
      memberIds: { $all: [ownerId, userId] }
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
          viewersIds: { $in: [userId] },
          memberIds: { $nin: [userId] },
          ownerIds: { $nin: [userId] }
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
  const {
    user: { _id: currentUserId }
  } = req;

  Cohort.findOneAndUpdate(
    { _id: cohortId, ownerIds: currentUserId, memberIds: userId },
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
    { _id: cohortId, ownerIds: ownerId, memberIds: userId },
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

      resp.status(404).send({ message: 'Cohort data not found.' });
    }
  );
};

const changeToMember = (req, resp) => {
  const { id: cohortId } = req.params;
  const { userId } = req.body;
  const {
    user: { _id: ownerId }
  } = req;

  Cohort.findOneAndUpdate(
    { _id: cohortId, ownerIds: { $all: [ownerId, userId] } },
    { $pull: { ownerIds: userId } },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't set user as a cohort's member."
        });
      }

      if (doc) {
        return resp.status(200).send({
          message: "User has been successfully set as a cohort's member."
        });
      }

      resp.status(404).send({ message: 'Cohort data not found.' });
    }
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
