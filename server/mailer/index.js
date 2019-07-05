const SendGridMail = require('@sendgrid/mail');

const mailTemplate = require('./mail-template');
const { PROJECT_NAME } = require('../common/variables');

const { SENDGRID_API_KEY } = process.env;

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
  const title = `Welcome to ${PROJECT_NAME}!`;
  const info = `It is nice to have you on board! Please just click the button below to confirm your account in ${PROJECT_NAME}!`;
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
      info,
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
  const resetUrl = `${host}/password-recovery/${resetToken}`;
  const title = `${PROJECT_NAME} - Reset your password`;
  const info =
    'Reset your password by clicking reset button. If you have not requested password reset to your account, just ignore this message.';
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
      info,
      value
    )
  };

  SendGridMail.send(message)
    .then(() => resp.send())
    .catch(() => resp.sendStatus(400));
};

module.exports = {
  sendInvitation,
  sendResetPasswordLink,
  sendSignUpConfirmationLink
};
