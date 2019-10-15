const { sendReport } = require('../../mailer');

const sendReportsJob = (agenda, jobName) => {
  agenda.define(jobName, async job => {
    try {
      await sendReport();
      console.log('sending report');
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = { sendReportsJob };
