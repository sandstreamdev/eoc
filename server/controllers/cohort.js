const Cohort = require('../models/cohort.model');
const {
  checkRole,
  filter,
  isValidMongoId,
  responseWithCohorts
} = require('../common/utils');
const List = require('../models/list.model');
const NotFoundException = require('../common/exceptions/NotFoundException');
const User = require('../models/user.model');
const {
  responseWithMember,
  responseWithMembers
} = require('../common/utils/index');

const createCohort = (req, resp) => {
  const { description, name, ownerId } = req.body;
  const cohort = new Cohort({
    name,
    description,
    ownerIds: ownerId
  });

  cohort.save((err, doc) =>
    err
      ? resp
          .status(400)
          .send({ message: 'Cohort not saved. Please try again.' })
      : resp
          .location(`/cohorts/${doc._id}`)
          .status(201)
          .send(doc)
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
    .select('_id name description favIds')
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
    '_id name description favIds isArchived',
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
            .send({ message: `Cohort "${name}" successfully updated.` })
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
    .populate('ownerIds', 'avatarUrl displayName _id')
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
        memberIds: membersData
      } = doc;

      if (isArchived) {
        return resp.status(200).json({ _id, isArchived, name });
      }

      const owners = ownerIds.map(owner => owner.id);
      const members = responseWithMembers(
        [...membersData, ...ownerIds],
        owners
      );
      const isOwner = checkRole(ownerIds, req.user._id);

      resp.status(200).json({
        _id,
        isOwner,
        isArchived,
        description,
        name,
        members
      });
    })
    .catch(err =>
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
    .then(() => {
      resp
        .status(200)
        .send({ message: `Cohort "${documentName}" successfully deleted.` });
    })
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
    { _id: cohortId, ownerIds: { $all: [ownerId, userId] } },
    { $pull: { ownerIds: userId } },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't remove owner from cohort."
        });
      }

      if (doc) {
        return resp.status(200).send({
          message: 'Owner successfully removed from cohort.'
        });
      }

      resp.status(404).send({ message: 'Cohort data not found.' });
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
    { $pull: { memberIds: userId } },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message: "Can't remove member from cohort."
        });
      }

      if (doc) {
        return resp.status(200).send({
          message: 'Member successfully removed from cohort.'
        });
      }

      resp.status(404).send({ message: 'Cohort data not found.' });
    }
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
    { $push: { ownerIds: userId }, $pull: { memberIds: userId } },
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
    { $push: { memberIds: userId }, $pull: { ownerIds: userId } },
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

  Cohort.findOne({ _id: cohortId, $or: [{ ownerIds: currentUser }] })
    .exec()
    .then(doc => {
      if (doc) {
        const { ownerIds } = doc;

        return User.findOne({ email })
          .exec()
          .then(doc => {
            const { _id, avatarUrl, displayName } = doc;
            return { _id, avatarUrl, displayName, ownerIds };
          })
          .catch(() =>
            resp.status(400).send({ message: 'User data not found.' })
          );
      }
      return resp
        .status(400)
        .send({ message: "You don't have permission to add new member" });
    })
    .then(data => {
      const { _id: newMemberId, displayName, avatarUrl, ownerIds } = data;

      Cohort.findOneAndUpdate(
        { _id: cohortId, memberIds: { $nin: [newMemberId] } },
        { $push: { memberIds: newMemberId } }
      )
        .exec()
        .then(doc => {
          if (doc) {
            const data = { avatarUrl, displayName, newMemberId };
            const dataToSend = responseWithMember(data, ownerIds);
            return resp.status(200).json(dataToSend);
          }
          return resp
            .status(400)
            .send({ message: 'User is already a member.' });
        })
        .catch(() => {
          throw new NotFoundException('Cohort data not found.');
        });
    })
    .catch(err => {
      if (err instanceof NotFoundException) {
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
