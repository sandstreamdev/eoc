const { EmailReportsFrequency } = require('../../common/variables');
const { getItemsForReport } = require('../../common/utils');
const { getMailer } = require('../../mailer/index');
const User = require('../../models/user.model');
const List = require('../../models/list.model');

const days = {
  0: EmailReportsFrequency.SUNDAY,
  1: EmailReportsFrequency.MONDAY,
  2: EmailReportsFrequency.TUESDAY,
  3: EmailReportsFrequency.WEDNESDAY,
  4: EmailReportsFrequency.THURSDAY,
  5: EmailReportsFrequency.FRIDAY,
  6: EmailReportsFrequency.SATURDAY
};

const sendReports = (agenda, jobName) => {
  agenda.define(jobName, async job => {
    const day = new Date().getDay();
    const reportDay = days[day];

    try {
      const users = await User.find(
        { emailReportsFrequency: reportDay },
        'displayName email'
      )
        .lean()
        .exec();

      const reportsData = await Promise.all(
        users.map(async user => getItemsForReport(List, user))
      );
      console.log(reportsData);

      // const mailer = getMailer();
      // const mailOptions = {
      //   from: 'no.reply@app.eoc.com',
      //   to: 'aleksander.fret@sandstream.pl',
      //   subject: 'Node.js Email with Secure OAuth',
      //   generateTextFromHTML: true,
      //   html: '<b>test sending email via gmail and agenda</b>'
      // };

      // await mailer.sendMail(mailOptions, (error, response) => mailer.close());
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = sendReports;
