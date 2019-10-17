const SendGridMail = require('@sendgrid/mail');

const mailTemplate = require('./mail-template');
const inviteTemplate = require('./invite/template');
const weeklyReportContent = require('./reports/weekly-content');
const { PROJECT_NAME, PROJECT_NAME_LONG } = require('../common/variables');
const { formatHours, getHours } = require('../common/utils');
const { EXPIRATION_TIME } = require('../common/variables');

const { SENDGRID_API_KEY } = process.env;

const fromField = `${PROJECT_NAME} <no.reply@app.eoc.com>`;
const subjectTemplate = subject => `☕ ${PROJECT_NAME} - ${subject}`;

SendGridMail.setApiKey(SENDGRID_API_KEY);

const sendInvitation = (req, resp) => {
  const {
    email: inviteeEmail,
    resource: { name: resourceName, url: resourceUrl }
  } = req.body;
  const {
    user: { email: inviterEmail, displayName: inviterName }
  } = req;
  const host = req.get('host');

  const message = {
    from: `${inviterName} (via ${PROJECT_NAME}) <${inviterEmail}>`,
    to: inviteeEmail,
    subject: `${inviterName} has invited you to join ${PROJECT_NAME} ✨`,
    html: inviteTemplate({
      host,
      projectName: PROJECT_NAME,
      inviteeEmail,
      inviterName,
      inviterEmail,
      projectNameLong: PROJECT_NAME_LONG,
      resourceName,
      resourceUrl: `${host}/${resourceUrl}`
    })
  };

  SendGridMail.send(message)
    .then(() =>
      resp.send({
        message: `Invitation to ${inviteeEmail} has been sent.`
      })
    )
    .catch(() => {
      resp
        .status(400)
        .send({ message: 'Invitation failed. Please try again.' });
    });
};

const sendSignUpConfirmationLink = (req, resp) => {
  const { displayName: name, email: receiver, signUpHash } = resp.locals;
  const host = req.get('host');
  const confirmUrl = `${host}/auth/confirm-email/${signUpHash}`;
  const hours = getHours(EXPIRATION_TIME);
  const title = `Welcome to ${PROJECT_NAME}!`;
  const formattedHours = formatHours(hours);
  const info1 = `<p>It is nice to have you on board! Please just click the button below to confirm your account in ${PROJECT_NAME}!</p>`;
  const info2 = `<p>Remember that confirmation button will be active only for ${formattedHours}.</p>`;
  const infoToSend = info1 + info2;
  const value = 'Confirm your account';

  const message = {
    to: receiver,
    from: 'no.reply@app.eoc.com',
    subject: `Confirm your account in ${PROJECT_NAME}!`,
    html: mailTemplate(
      name,
      `${PROJECT_NAME} team`,
      confirmUrl,
      title,
      infoToSend,
      value
    )
  };

  SendGridMail.send(message)
    .then(() => resp.send())
    .catch(() => resp.sendStatus(400));
};

const sendResetPasswordLink = (req, resp) => {
  const { email: receiver, displayName, resetToken } = resp.locales;
  const host = req.get('host');
  const hours = getHours(EXPIRATION_TIME);
  const resetUrl = `${host}/auth/recovery-password/${resetToken}`;
  const title = `${PROJECT_NAME} - Reset your password`;
  const formattedHours = formatHours(hours);
  const info1 =
    '<p>Reset your password by clicking reset button. If you have not requested password reset to your account, just ignore this message.</p>';
  const info2 = `<p>Remember that reset button will be active only for ${formattedHours}.</p>`;
  const infoToSend = info1 + info2;
  const value = 'Reset password';

  const message = {
    to: receiver,
    from: 'no.reply@app.eoc.com',
    subject: title,
    html: mailTemplate(
      displayName,
      `${PROJECT_NAME} team`,
      resetUrl,
      title,
      infoToSend,
      value
    )
  };

  SendGridMail.send(message)
    .then(() => resp.send())
    .catch(() => resp.sendStatus(400));
};

const sendReport = async (req, resp) => {
  const { data } = resp.locales;
  const host = req.get('host');
  const { email: receiver, displayName } = req.user;
  const message = {
    to: receiver,
    from: fromField,
    subject: subjectTemplate('Your weekly report'),
    html: weeklyReportContent({
      host,
      data,
      receiver: displayName,
      projectName: PROJECT_NAME
    })
  };

  try {
    const result = await SendGridMail.send(message);

    if (result) {
      resp.sendStatus(200);
    }
  } catch (error) {
    resp.sendStatus(400);
  }
};

module.exports = {
  sendInvitation,
  sendReport,
  sendResetPasswordLink,
  sendSignUpConfirmationLink
};
