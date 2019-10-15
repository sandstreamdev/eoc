const { transport } = require('../../mailer/gmail');

const sendReportsGmailJob = (agenda, jobName) => {
  agenda.define(jobName, async job => {
    try {
      const mailer = transport();
      const mailOptions = {
        from: 'no.reply@app.eoc.com',
        to: 'aleksander.fret@sandstream.pl',
        subject: 'Node.js Email with Secure OAuth',
        generateTextFromHTML: true,
        html: '<b>test sending email via gmail and agenda</b>'
      };

      await mailer.sendMail(mailOptions, (error, response) => mailer.close());
    } catch {
      // Ignore error
    }
  });
};

module.exports = { sendReportsGmailJob };
