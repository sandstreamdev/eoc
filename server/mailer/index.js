const SendGridMail = require('@sendgrid/mail');

const mailTemplate = require('./mail-template');
const inviteTemplate = require('./invite/template');
const confirmationTemplate = require('./confirmation/template');
const weeklyReportContent = require('./reports/weekly-content');
const { FULL_PROJECT_NAME, PROJECT_NAME } = require('../common/variables');
const { formatHours, getHours } = require('../common/utils');
const { EXPIRATION_TIME } = require('../common/variables');

const { SENDGRID_API_KEY } = process.env;

const fromField = `${PROJECT_NAME} <no.reply@app.eoc.com>`;
const subjectTemplate = subject => `☕ ${PROJECT_NAME} - ${subject}`;
const fullUrl = req => `${req.protocol}://${req.get('host')}`;

SendGridMail.setApiKey(SENDGRID_API_KEY);

const sendInvitation = (req, resp) => {
  const {
    email: inviteeEmail,
    resource: { name: resourceName, url: resourceUrl }
  } = req.body;
  const {
    user: { email: inviterEmail, displayName: inviterName }
  } = req;

  const message = {
    from: `${inviterName} (via ${PROJECT_NAME}) <${inviterEmail}>`,
    to: inviteeEmail,
    subject: `${inviterName} has invited you to join ${PROJECT_NAME} ✨`,
    html: inviteTemplate({
      host: fullUrl(req),
      projectName: PROJECT_NAME,
      fullProjectName: FULL_PROJECT_NAME,
      inviteeEmail,
      inviterName,
      inviterEmail,
      resourceName,
      resourceUrl: `${fullUrl(req)}${resourceUrl}`
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
  const { email: receiver, signUpHash } = resp.locals;
  const confirmUrl = `${fullUrl(req)}/auth/confirm-email/${signUpHash}`;
  const hours = getHours(EXPIRATION_TIME);
  const formattedHours = formatHours(hours);

  const message = {
    to: receiver,
    from: fromField,
    subject: '🎉 Welcome to EOC! Activate your account.',
    html: confirmationTemplate({
      host: fullUrl(req),
      projectName: PROJECT_NAME,
      timeSpan: formattedHours,
      confirmUrl
    })
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
    from: fromField,
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
  const { email: receiver, displayName } = req.user;
  const message = {
    to: receiver,
    from: fromField,
    subject: subjectTemplate('Your weekly report'),
    html: weeklyReportContent({
      host: fullUrl(req),
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
