const {
  default: {
    array: { partition },
    date: { formatDateTime }
  }
} = require('@sandstreamdev/std');

const templateStyles = require('../common/styles');
const mailTemplate = require('./weekly-template');

const styles = templateStyles({ maxWidth: 1024 });

const tableRow = data => `<tr><td>${data}</td></tr>`;

const tableHeaderCell = data => `<th style="${styles.thData}">${data}</th>`;

const tableCell = data => `<td style="${styles.tdData}">${data}</td>`;

const generateDataTable = ({ header, items, showAuthor, host }) => {
  let content = '';

  if (header) {
    content = tableRow(`<h5 style="${styles.h5}">${header}</h5>`);
  }

  content += `<tr><td><table style="${styles.tableData}">`;
  content += '<thead>';
  content += '<tr>';
  content += tableHeaderCell('Name');
  content += tableHeaderCell('Sack (Cohort)');

  if (showAuthor) {
    content += tableHeaderCell('Author');
  }

  content += tableHeaderCell('Requested at');
  content += '</tr>';
  content += '</thead>';
  content += '<tbody>';

  for (let i = 0; i < items.length; i++) {
    const { author, name, listName, listId, cohortName, requestedAt } = items[
      i
    ];

    content += `<tr style="${i % 2 ? styles.trOdd : ''}">`;
    content += tableCell(name);
    content += tableCell(
      `<a style="${
        styles.a
      }" href="${host}/sack/${listId}" target="_blank">${listName}</a>${
        cohortName ? ` (${cohortName})` : ''
      }`
    );

    if (showAuthor) {
      content += tableCell(author);
    }

    content += tableCell(
      requestedAt ? formatDateTime(new Date(requestedAt)) : ''
    );
    content += '</tr>';
  }

  content += '</tbody>';
  content += '</table></td></tr>';

  return content;
};

const generateRequestsContent = ({ requests, host }) => {
  const [stillWaiting, completed] = partition(item => item.done)(requests);
  let content = tableRow(
    `<h4 style="${styles.h4} margin-bottom: 0;">Your Requests</h4>`
  );

  if (completed.length === 0 && stillWaiting.length === 0) {
    content += '<p>No active requests.</p>';
  } else {
    if (completed.length > 0) {
      content += generateDataTable({ header: 'Completed', items: completed });
    }

    if (stillWaiting.length > 0) {
      content += '<tr><td style="padding: 4px;"></td></tr>';
      content += generateDataTable({
        header: 'Still waiting',
        items: stillWaiting,
        host
      });
    }
  }

  return content;
};

const generateTodosTable = ({ todos, host }) => {
  let content = tableRow(
    `<h4 style="${styles.h4} margin-bottom: 0;">Your Todos</h4>`
  );

  if (todos.length === 0) {
    content += '<p>All is done 🙂.</p>';
  } else {
    content += generateDataTable({ items: todos, showAuthor: true, host });
  }

  return content;
};

const mailContent = ({ data, receiver, host, projectName }) => {
  const { requests, todos } = data;
  let content = '<p style="margin-bottom:0;">Here is your weekly report.</p>';

  content += `<table style="${styles.tableContent}">`;
  content += generateTodosTable({ todos, host });

  if (requests) {
    const result = generateRequestsContent({ requests, host });

    if (result) {
      content += result;
    }
  }

  content += '</table>';

  return mailTemplate({
    receiver,
    content,
    host,
    styles,
    projectName
  });
};

module.exports = mailContent;
