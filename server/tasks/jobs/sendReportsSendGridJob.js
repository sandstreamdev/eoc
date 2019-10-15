const { sendReport } = require('../../mailer');

const sendReportsSendGridJob = (agenda, jobName) => {
  agenda.define(jobName, async job => {
    try {
      await sendReport();
    } catch (err) {
      // Ignore errors
    }
  });
};

module.exports = { sendReportsSendGridJob };
