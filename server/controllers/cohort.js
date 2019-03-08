const Cohort = require('../models/cohort.model');
const filter = require('../common/utilities');

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
      $or: [{ adminIds: req.user._id }, { memberIds: req.user._id }]
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

const updateCohortById = (req, resp) => {
  const { description, name } = req.body;
  const { id } = req.params;

  const dataToUpdate = filter(x => x !== undefined)({
    description,
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
        : resp.status(404).send({ message: `Cohort ${name} not found.` });
    }
  );
};

module.exports = {
  createCohort,
  getCohortsMetaData,
  updateCohortById
};
