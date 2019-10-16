const Agenda = require('agenda');

const { DB_URL } = require('../common/variables');
const sendReports = require('./jobs/sendReports');
const { enumerable } = require('../common/utils/helpers');

const connectionOpts = {
  db: { address: DB_URL, collection: 'jobs' }
};
const jobs = enumerable('jobs')('SEND_REPORTS');

const runAgenda = async () => {
  const agenda = new Agenda(connectionOpts);

  sendReports(agenda, jobs.SEND_REPORTS);

  await agenda.start();
  // await agenda.every('30 seconds', jobs.SEND_REPORTS);
};

module.exports = { runAgenda };
