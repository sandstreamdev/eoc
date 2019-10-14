const Agenda = require('agenda');

const { DB_URL } = require('../common/variables');

const runAgenda = async () => {
  const agenda = new Agenda({
    db: { address: DB_URL, collection: 'jobs' }
  });

  agenda.define('agendaJob', { priority: 'low', concurrency: 10 }, job => {
    console.log('agenda job');
  });

  agenda.define('sendEmails', { priority: 'low', concurrency: 10 }, job => {
    console.log('sending emails');
  });

  await agenda.start();
  await agenda.every('15 seconds', 'agendaJob');
  await agenda.every('30 seconds', 'sendEmails');
};

module.exports = { runAgenda };
