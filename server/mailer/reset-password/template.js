const footer = require('../common/footer');
const header = require('../common/header');
const templateStyles = require('../common/styles');

const styles = templateStyles({ maxWidth: 640 });

const mailTemplate = ({ resetUrl, host, projectName }) =>
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
                            }">Forgot your password? 😟</h2></center>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span>We received your request to reset your <a href="${host}" style="${
    styles.a
  }">${projectName}</a> password.</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <span>To reset your <a href="${host}" style="${
    styles.a
  }">${projectName}</a> password, please click the following button.</span>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 16px;">
                            <center>
                              <a href="${resetUrl}">
                                <input style="${
                                  styles.inputButton
                                }" value="Choose a new password" type="button" />
                              </a>
                            </center>
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
                        <b>Note:</b> If you did not initiate this request, you may safely ignore this message.<br />The request will expire shortly.
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
