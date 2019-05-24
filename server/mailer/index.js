const SendGridMail = require('@sendgrid/mail');

const mailTemplate = require('./mail-template');

SendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendInvitation = (req, resp) => {
  const { email: receiver } = req.body;
  const {
    user: { email: sender }
  } = req;

  const message = {
    to: receiver,
    from: sender,
    subject: 'Join EOC!',
    html: mailTemplate(receiver, sender)
  };

  SendGridMail.send(message)
    .then(() =>
      resp.status(200).send({
        message: `Invitation to ${receiver} has been sent.`
      })
    )
    .catch(() => {
      resp
        .status(400)
        .send({ message: 'Invitation failed. Please try again.' });
    });
};

module.exports = { sendInvitation };
