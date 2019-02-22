const Cohort = require('../models/cohort.model');

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

module.exports = {
  createCohort,
  getCohortById,
  getCohortsMetaData
};
