const SendGridMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const mailTemplate = require('./mail-template');
const weeklyReportContent = require('./reports/weekly-content');
const { PROJECT_NAME } = require('../common/variables');
const { formatHours, getHours } = require('../common/utils');
const { EXPIRATION_TIME } = require('../common/variables');

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_API_USER,
  SENDGRID_API_KEY
} = process.env;
const {
  auth: { OAuth2 }
} = google;

const oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);

const getMailer = () => {
  oauth2Client.setCredentials({
    refresh_token: GOOGLE_REFRESH_TOKEN
  });

  const accessToken = oauth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: GOOGLE_API_USER,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: GOOGLE_REFRESH_TOKEN,
      accessToken
    }
  });

  return transport;
};

const fromField = `${PROJECT_NAME} <no.reply@app.eoc.com>`;
const subjectTemplate = subject => `☕ ${PROJECT_NAME} - ${subject}`;

SendGridMail.setApiKey(SENDGRID_API_KEY);

const sendInvitation = (req, resp) => {
  const { email: receiver } = req.body;
  const {
    user: { email: sender }
  } = req;
  const host = req.get('host');
  const title = `Join ${PROJECT_NAME} today!`;
  const info = `Would you like to join me in amazing ${PROJECT_NAME} app?`;
  const value = `JOIN ${PROJECT_NAME}`;

  const message = {
    to: receiver,
    from: sender,
    subject: `Join ${PROJECT_NAME}!`,
    html: mailTemplate(receiver, sender, host, title, info, value)
  };

  SendGridMail.send(message)
    .then(() =>
      resp.send({
        message: `Invitation to ${receiver} has been sent.`
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

const sendReport = async (host, data) => {
  const { displayName, receiver, requests, todos } = data;
  const message = {
    to: receiver,
    from: fromField,
    subject: subjectTemplate('Your weekly report'),
    html: weeklyReportContent({
      host,
      data: { requests, todos },
      receiver: displayName,
      projectName: PROJECT_NAME
    })
  };

  const mailer = getMailer();

  await mailer.sendMail(message);
  mailer.close();
};

const sendReportOnDemand = async (req, resp) => {
  const host = req.get('host');

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
