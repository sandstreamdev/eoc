const footer = require('../common/footer');
const header = require('../common/header');
const templateStyles = require('../common/styles');

const styles = templateStyles({ maxWidth: 640 });

const mailTemplate = ({ confirmUrl, host, projectName, timeSpan }) =>
  `<!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
      </head>
      <body style="${styles.body}">
        <center>
          ${header({ styles, projectName })}
          <table>
            <tr>
              <td>
                <table style="${styles.boxMain}">
                  <tr>
                    <td style="${styles.tdContent}">
                      <table style="${styles.tableContent}">
                        <tr>
                          <td>
                            <center><h2 style="${
                              styles.h2
                            }">Welcome aboard! 🎉</h2></center>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span>
                              Thank you for creating an <a href="${host}" style="${
    styles.a
  }">${projectName}</a> account.
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span>Activate you account now and check how <a href="${host}" style="${
    styles.a
  }">${projectName}</a> can help you achieve your goals.</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 16px 0;">
                            <center>
                              <a href="${confirmUrl}">
                                <input style="${
                                  styles.inputButton
                                }" value="Activate My Account" type="button" />
                              </a>
                            </center>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            Activation button will be active only for ${timeSpan}.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top: 16px">
                      Sincerely,
                    </td>
                  </tr>
                  <tr>
                    <td>${projectName} team</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table style="${styles.boxBottom}">
                  <tr>
                    <td>
                      <center>
                        <b>Note:</b> If you didn't sign up for an account on our site, please simply ignore this email.
                      </center>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          ${footer({ host, styles, projectName })}
        </center>
      </body>
    </html>
  `;

module.exports = mailTemplate;
