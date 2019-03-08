const Cohort = require('../models/cohort.model');
const { checkRole, filter } = require('../common/utilities');
const List = require('../models/shoppingList.model');

const createCohort = (req, resp) => {
  const { description, name, adminId } = req.body;

  const cohort = new Cohort({
    name,
    description,
    adminIds: adminId
  });

  cohort.save((err, doc) => {
    err
      ? resp.status(400).send({ message: err.message })
      : resp
          .location(`/cohorts/${doc._id}`)
          .status(201)
          .send(doc);
  });
};

const getCohortsMetaData = (req, resp) => {
  Cohort.find(
    {
      $or: [{ adminIds: req.user._id }, { memberIds: req.user._id }],
      isArchived: false
    },
    '_id name description',
    { sort: { createdAt: -1 } },
    (err, cohorts) => {
      if (!cohorts) {
        return resp.status(404).send({ message: 'No cohorts found!' });
      }

      return err
        ? resp.status(400).send({ message: err.message })
        : resp.status(200).send(cohorts);
    }
  );
};

const getArchivedCohortsMetaData = (req, resp) => {
  Cohort.find(
    {
      $or: [
        { adminIds: req.user._id },
        { ordererIds: req.user._id },
        { purchaserIds: req.user._id }
      ],
      isArchived: true
    },
    '_id name description isArchived',
    { sort: { created_at: -1 } },
    (err, docs) => {
      if (err) {
        return resp.status(400).send({ message: err.message });
      }
      if (!docs) {
        return resp.status(404).send('There is no archived cohorts!');
      }
      resp.status(200).send(docs);
    }
  );
};

const updateCohortById = (req, resp) => {
  const { description, isArchived, name } = req.body;
  const { id: cohortId } = req.params;

  const dataToUpdate = filter(x => x !== undefined)({
    description,
    isArchived,
    name
  });

  Cohort.findOneAndUpdate(
    {
      _id: cohortId,
      $or: [{ adminIds: req.user._id }]
    },
    dataToUpdate,
    { new: true },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            "Oops we're sorry, an error occurred while processing the cohort"
        });
      }

      if (!doc) {
        return resp.status(401).send({
          message: 'You have no permissions to perform this action'
        });
      }

      resp.status(200).send({
        message: `Cohort "${doc.name}" was successfully updated!`
      });
    }
  );
};

const getCohortData = (req, resp) => {
  Cohort.findOne(
    {
      _id: req.params.id,
      $or: [{ adminIds: req.user._id }, { memberIds: req.user._id }]
    },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({ message: err.message });
      }

      if (!doc) {
        return resp
          .status(404)
          .send({ message: 'Data not found for given cohort id!' });
      }

      const { adminIds, _id, isArchived, description, name } = doc;

      if (isArchived) {
        return resp.status(200).json({ _id, isArchived, name });
      }

      const isAdmin = checkRole(adminIds, req.user._id);
      const data = isAdmin
        ? { _id, isAdmin, isArchived, description, name }
        : { _id, isArchived, description, name };

      return resp.status(200).json(data);
    }
  );
};

const deleteCohortById = (req, resp) => {
  let documentName = '';
  Cohort.findOne({ _id: req.params.id, adminIds: req.user._id })
    .then(doc => {
      if (!doc) {
        return resp.status(401).send({
          message: "You don't have permission to delete this cohort"
        });
      }
      documentName = doc.name;
      return List.deleteMany({ cohortId: req.params.id });
    })
    .then(() => Cohort.deleteOne({ _id: req.params.id }))
    .then(() => {
      resp
        .status(200)
        .send({ message: `Cohort ${documentName} was successfully deleted!` });
    })
    .catch(err => {
      resp.status(400).send({
        message: "Oops we're sorry, an error occurred while deleting the cohort"
      });
    });
};

module.exports = {
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortData,
  getCohortsMetaData,
  updateCohortById
};
