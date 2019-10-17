const Agenda = require('agenda');

const { DB_URL } = require('../common/variables');
const sendReports = require('./jobs/sendReports');
const { enumerable } = require('../common/utils/helpers');

const connectionOptions = {
  db: { address: DB_URL, collection: 'jobs' }
};
const jobs = enumerable('jobs')('SEND_REPORTS');

const runAgenda = async () => {
  try {
    const agenda = new Agenda(connectionOptions);

    sendReports(agenda, jobs.SEND_REPORTS);

    await agenda.start();
    await agenda.every('0 0 * * *', jobs.SEND_REPORTS);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

module.exports = runAgenda;
