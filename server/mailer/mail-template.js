const { PROJECT_NAME } = require('../common/variables');

const mailTemplate = (receiver, sender, hostUrl, title, info, value) => {
  return `
      <!DOCTYPE html>
      <html>
        <body style="background-color: #E9ECF2; 
                     padding-top: 20px;">
          <center>
            <table
              style="background-color: #fff;
                     font-family: 'ProximaNova-Regular', Helvetica, Arial, sans-serif;
                     font-size: 14px;
                     color: #627085;
                     max-width:500px;
                     border-radius:4px;
                     margin: 20px 20px 20px 20px;
                     padding: 40px;
                     box-shadow:0 1px 3px #B7C0CC, 0 1px 2px #B7C0CC;"
            >
              <tr style="width:100%;">
                <td style="width:100%;"
                    align="left"
                >
                  ${PROJECT_NAME} App
                </td>
              </tr>
              <tr style="width:100%;"> 
                <td
                  style="font-size: 22px;
                         padding-top:20px;
                         padding-bottom:0px;
                         width:100%;"
                >
                 ${title}
                </td>
              </tr>
              <tr style="width:100%;">
                <td
                  style="padding: 20px 0 10px 0;
                         width:100%"
                >
                  Hey ${receiver},
                </td>
              </tr>
              <tr style="padding-top:5px;
                         padding-bottom:20px;
                         width:100%;"
              >
                <td style="width=100%;">${info}</td>
              </tr>
              <tr style="padding-top:40px;
                         padding-bottom:0px;
                         width:100%;"
              >
                <td style="width:100%;">Sincerely,</td>
              </tr>
              <tr style="width:100%;">
                <td style="width:100%;">${sender}</td>
              </tr>
              <tr style="width:100%;">
                <td style="padding-top:40px;
                           width:100%;">
                  <a href="http://${hostUrl}">
                    <input style="
                      background: #ef9b1f;
                      border: 0;
                      color:#fff;
                      font-size: 14px;
                      font-weight: 500;
                      line-height: 1.2;
                      padding: 8px 16px;"
                      type="button";
                      value="${value}"
                    />
                  </a>
                </td>
              </tr>
            </table>
          </center>
        </body>
      </html>
   `;
};

module.exports = mailTemplate;
