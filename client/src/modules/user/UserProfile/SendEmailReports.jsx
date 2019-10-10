import React, { PureComponent } from 'react';

import './SendEmailReports.scss';

class SendEmailReports extends PureComponent {
  render() {
    return (
      <section className="email-reports">
        <h2 className="email-reports__heading">Send email reports</h2>
        <ul className="email-reports__list">
          <li className="email-reports__list-item">
            Send email report now
            <button className="primary-button" type="submit">
              Send report
            </button>
          </li>
        </ul>
      </section>
    );
  }
}

export default SendEmailReports;
