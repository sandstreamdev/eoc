const footer = require('../common/footer');
const header = require('../common/header');

const mailTemplate = ({ content, host, styles, projectName }) =>
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
                    <td>
                      <center><h2 style="${
                        styles.h2
                      }">Here is your weekly report 📝</h2></center>
                          </td>
                        </tr>
                  <tr>
                    <td style="${styles.tdContent}">${content}</td>
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
                        Too many emails? Switch off these reports on your <a style="${
                          styles.a
                        }" href="${host}/user-profile" target="_blank">account page</a>.
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
