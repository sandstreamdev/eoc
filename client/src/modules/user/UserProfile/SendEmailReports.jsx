import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import './SendEmailReports.scss';
import {
  prepareItemsRequestedByMe,
  prepareItemsOwnedByMe
} from '../model/actions';
import AlertBox from 'common/components/AlertBox';
import { MessageType } from 'common/constants/enums';

class SendEmailReports extends PureComponent {
  handleReports = async () => {
    // do smoent
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
            <FormattedMessage id="email-reports.items" />
            <button
              className="primary-button"
              onClick={this.handleReports}
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
