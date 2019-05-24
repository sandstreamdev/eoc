const { TEMP_DEV } = require('../common/variables');

const mailTemplate = (receiver, sender) => {
  const date = new Date().toUTCString();

  return `
      <!DOCTYPE html>
      <html>
        <body style="background-color: #E9ECF2;">
          <center>
            <table
              style="color: #627085;
                        font-family: 'ProximaNova-Regular', Helvetica, Arial, sans-serif;
                        max-width:500px;"
            >
              <tr>
                <td style="width:80%;" align="left">EOC App</td>
                <td align="right">${date}</td>
              </tr>
            </table>
            <table
              style="background-color: #fff;
                          font-family: 'ProximaNova-Regular', Helvetica, Arial, sans-serif;
                          font-size: 0.9rem;
                          color: #627085;
                          max-width:500px;
                          border-radius:4px;
                          margin: 5px 20px 20px 20px;
                          padding: 40px;
                          box-shadow:0 1px 3px #B7C0CC, 0 1px 2px #B7C0CC;"
            >
              <tr>
                <td
                  style="font-size: 1.4rem;
                padding-top:20px;padding-bottom:0px;"
                >
                 Join EOC today!
                </td>
              </tr>
              <tr>
                <td
                  style="padding-top:20px;
                        padding-bottom:10px;"
                >
                  Hey ${receiver},
                </td>
              </tr>
              <tr style="padding-top:5px;padding-bottom:20px;">
                <td>Would you like to join me in amazing EOC app?</td>
              </tr>
              <tr style="padding-top:40px;padding-bottom:0px;">
                <td>Sincerely,</td>
              </tr>
              <tr>
                <td>${sender}</td>
              </tr>
              <tr>
                <td style="padding-top:40px;">
                  <a href="${TEMP_DEV}"
                    ><input
                      value="JOIN EOC"
                      type="button"
                      style="background: #ef9b1f;
                padding: 8px 16px;
                line-height: 1.2;
                font-weight: 500;
                border: 0;
                color:#fff;
                font-size: 14px"
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
