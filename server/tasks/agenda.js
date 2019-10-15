const Agenda = require('agenda');

const { DB_URL } = require('../common/variables');
const { sendReportsJob } = require('./jobs/sendReports');
const { sendReportsGmailJob } = require('./jobs/sendReportsGmail');

const connectionOpts = {
  db: { address: DB_URL, collection: 'jobs' }
};

const runAgenda = async () => {
  const agenda = new Agenda(connectionOpts);

  // sendReportsJob(agenda, 'sendReport');
  sendReportsGmailJob(agenda, 'sendReportGmail');

  agenda.define('agendaJob', { priority: 'low', concurrency: 10 }, job => {
    console.log('agenda job');
  });

  agenda.define('clearDemoData', { priority: 'low', concurrency: 10 }, job => {
    console.log('clear demo data');
  });

  await agenda.start();
  await agenda.every('15 seconds', 'agendaJob');
  await agenda.every('30 seconds', 'clearDemoData');
  await agenda.every('45 seconds', 'sendReportGmail');
  // await agenda.every('1 minute', 'sendReport');
};

module.exports = { runAgenda };
