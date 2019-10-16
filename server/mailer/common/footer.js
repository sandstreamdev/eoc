const footer = ({ host, styles, projectName }) =>
  `<table style="${styles.footer}">
    <tr>
      <td>
        <center>${projectName} is a service provided by <a style="${
    styles.a
  }" href="https://sandstream.pl/" target="_blank">Sandstream Development Sp. z o.o.</a></cener>
      </td>
    </tr>
    <tr>
      <td>
        <center>Address: Ślężna 104, 53-111 Wrocław, Poland. Contact: +48 573 989 732 | <a style="${
          styles.a
        }" href="mailto:contact@sandstream.pl">contact@sandstream.pl</a></center>
      </td>
    </tr>
    <tr>
      <td>
        <center><a style="${
          styles.a
        }" href="${host}/privacy-policy" target="_blank">Terms Of Service</a> | <a style="${
    styles.a
  }" href="${host}/privacy-policy" target="_blank">Privacy Policy</a></center>
      </td>
    </tr>
  </table>`;

module.exports = footer;
