const header = ({ styles, projectName }) => `<table style="${styles.header}">
  <tr>
    <td>
      <span>${projectName}</span>
    </td>
  </tr>
</table>`;

module.exports = header;
