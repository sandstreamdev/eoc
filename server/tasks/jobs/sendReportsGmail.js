const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// const { mailer } = require('../../mailer/gmail');

// const { USER, TO } = process.env;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN,
  USER,
  TO
} = process.env;
const {
  auth: { OAuth2 }
} = google;

const sendReportsGmailJob = (agenda, jobName) => {
  agenda.define(jobName, async job => {
    console.log('start sending');
    try {
      // const smtp = mailer();

      const oauth2Client = new OAuth2(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );

      //const mailer = () => {
      oauth2Client.setCredentials({
        refresh_token: GOOGLE_REFRESH_TOKEN
      });

      const accessToken = await oauth2Client.getAccessToken();
      console.log('access token', accessToken);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: USER,
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          refreshToken: GOOGLE_REFRESH_TOKEN,
          accessToken
        }
      });

      transporter.on('token', token => console.log(token));
      console.log('access token', accessToken);
      const mailOptions = {
        from: USER,
        to: TO,
        subject: 'Node.js Email with Secure OAuth',
        generateTextFromHTML: true,
        html: '<b>test sending email via gmail and agenda</b>'
      };

      await transporter.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        transporter.close();
      });

      console.log('sending gmail eport');
    } catch (err) {
      console.error(err);
    }
  });
};

module.exports = { sendReportsGmailJob };
