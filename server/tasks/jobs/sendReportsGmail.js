const { mailer } = require('../../mailer/gmail');

const { FROM, TO } = process.env;

const sendReportsGmailJob = (agenda, jobName) => {
  agenda.define(jobName, async job => {
    try {
      const smtp = mailer();
      const mailOptions = {
        from: FROM,
        to: TO,
        subject: 'Node.js Email with Secure OAuth',
        generateTextFromHTML: true,
        html: '<b>test sending email via gmail and agenda</b>'
      };

      await smtp.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtp.close();
      });

      console.log('sending gmail eport');
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = { sendReportsGmailJob };
