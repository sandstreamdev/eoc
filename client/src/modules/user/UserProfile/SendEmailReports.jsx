import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import './SendEmailReports.scss';
import { sendEmailReports } from '../model/actions';
import AlertBox from 'common/components/AlertBox';
import { MessageType } from 'common/constants/enums';

class SendEmailReports extends PureComponent {
  state = {
    error: false
  };

  handleOnClick = async () => {
    try {
      this.setState({ error: false });

      await sendEmailReports();
    } catch {
      this.setState({ error: true });
    }
  };

  render() {
    const { error } = this.state;

    return (
      <section className="email-reports">
        {error && (
          <AlertBox type={MessageType.ERROR}>
            <FormattedMessage id="email-reports.sending-failure" />
            <span> </span>
            <FormattedMessage id="common.try-again" />
          </AlertBox>
        )}
        <h2 className="email-reports__heading">
          <FormattedMessage id="email-reports.heading" />
        </h2>
        <ul className="email-reports__list">
          <li className="email-reports__list-item">
            <FormattedMessage id="email-reports.text" />
            <button
              className="primary-button"
              onClick={this.handleOnClick}
              type="submit"
            >
              <FormattedMessage id="email-reports.submit-button" />
            </button>
          </li>
        </ul>
      </section>
    );
  }
}

export default SendEmailReports;
