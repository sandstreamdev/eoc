const footer = require('../common/footer');
const header = require('../common/header');
const templateStyles = require('../common/styles');

const styles = templateStyles({ maxWidth: 640 });

const mailTemplate = ({
  host,
  projectName,
  inviteeEmail,
  inviterName,
  inviterEmail,
  fullProjectName,
  resourceName,
  resourceUrl
}) =>
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
                            }">You're invited to join <a href="${resourceUrl}" style="${
    styles.a
  }">${resourceName}</a> on ${projectName} ✨</h2></center>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              <a href="${host}" style="${
    styles.a
  }">${projectName} (${fullProjectName})</a> is an office inventory tracking app for teams. Add requests for missing things and see what other team members think about it in real time.
                            </p>
                            <p>You can also use it for planning other things - all depends on your creativity and needs.</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding: 8px 0;">
                            <p>
                              ${inviterName} (<a href="mailto:${inviterEmail}" style="${
    styles.a
  }">${inviterEmail}</a>) sent you this invitation.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-top: 16px;">
                            <center>
                              <a href="${host}">
                                <input style="${
                                  styles.inputButton
                                }" value="Join now" type="button" />
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
                        <b>Note:</b> This invitation was intended for <a href="mailto:${inviteeEmail}" style="${
    styles.a
  }">${inviteeEmail}</a>. If you were not expecting this invitation, you may safely ignore this email.
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
