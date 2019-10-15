const Agenda = require('agenda');

const { DB_URL } = require('../common/variables');
const { sendReportsSendGridJob } = require('./jobs/sendReportsSendGridJob');
const { sendReportsGmailJob } = require('./jobs/sendReportsGmail');

const connectionOpts = {
  db: { address: DB_URL, collection: 'jobs' }
};

const runAgenda = async () => {
  const agenda = new Agenda(connectionOpts);

  sendReportsSendGridJob(agenda, 'sendReport');
  sendReportsGmailJob(agenda, 'sendReportGmail');

  await agenda.start();
  await agenda.every('2 minutes', 'sendReport');
  await agenda.every('1 minute', 'sendReportGmail');
};

module.exports = { runAgenda };
