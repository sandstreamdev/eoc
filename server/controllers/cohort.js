const Cohort = require('../models/cohort.model');
const { checkRole, filter, isIdValid } = require('../common/utilities');
const List = require('../models/shoppingList.model');
const NotFoundException = require('../common/exceptions/NotFoundException');

const createCohort = (req, resp) => {
  const { description, name, adminId } = req.body;

  const cohort = new Cohort({
    name,
    description,
    adminIds: adminId
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
  Cohort.find(
    {
      $or: [{ adminIds: req.user._id }, { memberIds: req.user._id }],
      isArchived: false
    },
    '_id name description',
    { sort: { createdAt: -1 } },
    (err, docs) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while fetching the cohorts data. Please try again.'
        });
      }

      docs
        ? resp.status(200).send(docs)
        : resp.status(404).send({ message: 'No cohorts data found.' });
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
      resp.status(200).send(docs);
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
      $or: [{ adminIds: req.user._id }]
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
            .send({ message: `Cohort ${name} successfully updated.` })
        : resp.status(404).send({ message: 'Cohort  not found.' });
    }
  );
};

const getCohortDetails = (req, resp) => {
  if (!isIdValid(req.params.id)) {
    return resp
      .status(404)
      .send({ message: `Data of list id: ${req.params.id} not found.` });
  }
  Cohort.findOne(
    {
      _id: req.params.id,
      $or: [{ adminIds: req.user._id }, { memberIds: req.user._id }]
    },
    (err, doc) => {
      if (err) {
        return resp.status(400).send({
          message:
            'An error occurred while fetching the cohort data. Please try again.'
        });
      }

      if (!doc) {
        return resp.status(404).send({ message: 'Cohort data not found.' });
      }

      const { adminIds, _id, isArchived, description, name } = doc;

      if (isArchived) {
        return resp.status(200).json({ _id, isArchived, name });
      }

      const isAdmin = checkRole(adminIds, req.user._id);

      resp.status(200).json({ _id, isAdmin, isArchived, description, name });
    }
  );
};

const deleteCohortById = (req, resp) => {
  let documentName = '';
  Cohort.findOne({ _id: req.params.id, adminIds: req.user._id })
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
        .send({ message: `Cohort ${documentName} successfully deleted.` });
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

module.exports = {
  createCohort,
  deleteCohortById,
  getArchivedCohortsMetaData,
  getCohortDetails,
  getCohortsMetaData,
  updateCohortById
};
