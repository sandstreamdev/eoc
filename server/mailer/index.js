const SendGridMail = require('@sendgrid/mail');

const mailTemplate = require('./mail-template');
const signUpMailTemplate = require('./mail-signup-template');
const { PROJECT_NAME } = require('../common/variables');

const { SENDGRID_API_KEY } = process.env;

SendGridMail.setApiKey(SENDGRID_API_KEY);

const sendInvitation = (req, resp) => {
  const { email: receiver } = req.body;
  const {
    user: { email: sender }
  } = req;
  const { protocol } = req;
  const host = req.get('host');
  const url = `${protocol}://${host}`;

  const message = {
    to: receiver,
    from: sender,
    subject: `Join ${PROJECT_NAME}!`,
    html: mailTemplate(receiver, sender, url)
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
  const { protocol } = req;
  const host = req.get('host');
  const url = `${protocol}://${host}`;
  const confirmUrl = `${url}/auth/confirm-email/${signUpHash}`;

  const message = {
    to: receiver,
    from: 'no.replay@app.eoc.com',
    subject: `Confirm your account in ${PROJECT_NAME}!`,
    html: signUpMailTemplate(url, name, confirmUrl)
  };

  SendGridMail.send(message);

  resp.send();
};

module.exports = { sendInvitation, sendSignUpConfirmationLink };
