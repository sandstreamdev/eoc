const Cohort = require('../models/cohort.model');
const filter = require('../common/utilities');

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
      $or: [{ adminIds: req.user._id }, { memberIds: req.user._id }]
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

const getCohortById = (req, resp) => {
  Cohort.findById({ _id: req.params.id }, (err, doc) => {
    if (!doc) {
      return resp.status(404).send({ message: 'No cohort of given id' });
    }

    return err
      ? resp.status(400).send({ message: err.message })
      : resp.status(200).json(doc);
  });
};

const updateCohortById = (req, resp) => {
  const { description, name } = req.body;
  const { id: cohortId } = req.params;

  const dataToUpdate = filter(x => x !== undefined)({
    description,
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
      if (!doc) {
        return resp.status(404).send({
          message: 'You have no permissions to perform this action'
        });
      }

      if (err) {
        return resp.status(400).send({
          message:
            "Oops we're sorry, an error occurred while processing the cohort"
        });
      }

      return resp.status(200).send({
        message: `Cohort "${doc.name}" was successfully updated!`
      });
    }
  );
};

module.exports = {
  createCohort,
  getCohortById,
  getCohortsMetaData,
  updateCohortById
};
