const SendGridMail = require('@sendgrid/mail');

const inviteTemplate = require('./invite/template');
const confirmationTemplate = require('./confirmation/template');
const resetPasswordTemplate = require('./reset-password/template');
const weeklyReportContent = require('./reports/weekly-content');
const { FULL_PROJECT_NAME, PROJECT_NAME } = require('../common/variables');

const { SENDGRID_API_KEY } = process.env;

const fromField = `${PROJECT_NAME} <no.reply@app.eoc.com>`;
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

  const message = {
    to: receiver,
    from: fromField,
    subject: '🎉 Welcome to EOC! Activate your account.',
    html: confirmationTemplate({
      host: fullUrl(req),
      projectName: PROJECT_NAME,
      confirmUrl
    })
  };

  SendGridMail.send(message)
    .then(() => resp.send())
    .catch(() => resp.sendStatus(400));
};

const sendResetPasswordLink = (req, resp) => {
  const { email: receiver, resetToken } = resp.locals;
  const resetUrl = `${fullUrl(req)}/auth/recovery-password/${resetToken}`;

  const message = {
    to: receiver,
    from: fromField,
    subject: '🔑 Reset password.',
    html: resetPasswordTemplate({
      host: fullUrl(req),
      projectName: PROJECT_NAME,
      resetUrl
    })
  };

  SendGridMail.send(message)
    .then(() => resp.send())
    .catch(() => resp.sendStatus(400));
};

const sendReport = async (host, reportData) => {
  const { displayName, receiver, requests, todos } = reportData;
  const message = {
    to: receiver,
    from: fromField,
    subject: '📝 Your weekly report',
    html: weeklyReportContent({
      host,
      data: { requests, todos },
      receiver: displayName,
      projectName: PROJECT_NAME
    })
  };

  return SendGridMail.send(message);
};

const sendReportOnDemand = async (req, resp) => {
  const host = fullUrl(req);

  try {
    const result = await sendReport(host, resp.locals);

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
  sendReportOnDemand,
  sendResetPasswordLink,
  sendSignUpConfirmationLink
};
