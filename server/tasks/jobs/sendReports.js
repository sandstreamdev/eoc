const { EmailReportsFrequency } = require('../../common/variables');
const { getItemsForReport } = require('../../common/utils');
const { sendReport } = require('../../mailer');
const User = require('../../models/user.model');
const List = require('../../models/list.model');
const { fireAndForget } = require('../../common/utils');

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
    const { HOST } = process.env;

    try {
      const users = await User.find(
        { emailReportsFrequency: reportDay },
        'displayName email'
      )
        .lean()
        .exec();

      users.forEach(async user => {
        try {
          const report = await getItemsForReport(List, user);

          if (report) {
            fireAndForget(sendReport(HOST, report));
          }
        } catch {
          // Ignore errors
        }
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  });
};

module.exports = sendReports;
