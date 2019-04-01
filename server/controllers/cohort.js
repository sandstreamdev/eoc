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
  responseWithUsers,
  responseWithUser
} = require('../common/utils/index');

const createCohort = (req, resp) => {
  const { description, name, ownerId } = req.body;

  const cohort = new Cohort({
    name,
    description,
    owners: ownerId
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
    $or: [{ owners: userId }, { members: userId }],
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
    .catch(err => {
      console.log(err);
      return resp.status(400).send({
        message:
          'An error occurred while fetching the cohorts data. Please try again.'
      });
    });
};

const getArchivedCohortsMetaData = (req, resp) => {
  const {
    user: { _id: userId }
  } = req;
  Cohort.find(
    {
      $or: [{ owners: userId }, { members: userId }],
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
      $or: [{ owners: req.user._id }]
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
    $or: [{ owners: req.user._id }, { members: req.user._id }]
  })
    .populate('members', 'avatarUrl displayName _id')
    .populate('owners', 'avatarUrl displayName _id')
    .exec()
    .then(doc => {
      if (!doc) {
        return resp.status(404).send({
          message: `Data of cohort id: ${req.params.id} not found.`
        });
      }

      const {
        owners,
        _id,
        isArchived,
        description,
        name,
        members: membersData
      } = doc;
      const ownerIds = owners.map(owner => owner.id);
      const members = responseWithUsers([...membersData, ...owners], ownerIds);

      if (isArchived) {
        return resp.status(200).json({ _id, isArchived, name });
      }

      const isOwner = checkRole(owners, req.user._id);

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
  Cohort.findOne({ _id: req.params.id, owners: req.user._id })
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
      $or: [{ owners: userId }, { members: userId }]
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
      $or: [{ owners: userId }, { members: userId }]
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

// const getMembers = (req, resp) => {
//   const { id: cohortId } = req.params;

//   Cohort.findOne({ _id: cohortId }, 'members owners', (err, doc) => {
//     if (err) {
//       return resp.status(400).send({
//         message: "Can't get members data. Please try again."
//       });
//     }

//     if (doc) {
//       const { members, owners } = doc;

//       User.find({ _id: [...members, ...owners] }, (err, docs) => {
//         if (err) {
//           return resp.status(400).send({
//             message: "Can't get members data. Please try again."
//           });
//         }
//         const users = responseWithUsers(docs, owners);
//         resp.status(200).json(users);
//       });
//     }
//   });
// };

const addMember = (req, resp) => {
  const {
    user: { _id: currentUser }
  } = req;
  const { id: cohortId } = req.params;
  const { email } = req.body;

  Cohort.findOne({ _id: cohortId, $or: [{ owners: currentUser }] })
    .exec()
    .then(doc => {
      if (doc) {
        return User.findOne({ email })
          .exec()
          .then(doc => {
            const { _id, avatarUrl, displayName, email } = doc;
            return { _id, avatarUrl, displayName, email };
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
      const { _id: newMemberId, displayName, avatarUrl } = data;
      Cohort.findOneAndUpdate(
        { _id: cohortId, members: { $nin: [newMemberId] } },
        { $push: { members: newMemberId } }
      )
        .exec()
        .then(doc => {
          if (doc) {
            const data = { avatarUrl, displayName, newMemberId };
            const dataToSend = responseWithUser(data);
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
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  removeFromFavourites,
  updateCohortById
};
