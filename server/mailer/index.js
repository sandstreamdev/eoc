const SendGridMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const inviteTemplate = require('./invite/template');
const confirmationTemplate = require('./confirmation/template');
const resetPasswordTemplate = require('./reset-password/template');
const weeklyReportContent = require('./reports/weekly-content');
const { FULL_PROJECT_NAME, PROJECT_NAME } = require('../common/variables');

const {
  GOOGLE_API_USER,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  SENDGRID_API_KEY
} = process.env;
const {
  auth: { OAuth2 }
} = google;
const oauth2Client = new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, '/');

const getMailer = () => {
  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN
  });

  const accessToken = oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      accessToken,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      type: 'OAuth2',
      user: GOOGLE_API_USER
    }
  });
};

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

const sendReport = async (host, data) => {
  const { displayName, receiver, requests, todos } = data;
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
  const mailer = getMailer();
  const result = mailer.sendMail(message);

  mailer.close();

  return result;
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
