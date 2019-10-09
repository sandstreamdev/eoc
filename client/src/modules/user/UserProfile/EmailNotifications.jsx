import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
// import PropTypes from 'prop-types';

import SwitchButton from 'common/components/SwitchButton';
import './EmailNotification.scss';
import { IntlPropType } from 'common/constants/propTypes';

class EmailNotifications extends Component {
  state = {
    weekly: true,
    never: false
  };

  setWeekly = () => this.setState({ weekly: true, never: false });

  setNever = () => this.setState({ never: true, weekly: false });

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const { weekly, never } = this.state;

    return (
      <section className="email-notifications">
        <h2 className="email-notifications__heading">
          <FormattedMessage id="email.notification.heading" />
        </h2>
        <ul className="email-notifications__list">
          <li className="email-notifications__list-item">
            <SwitchButton
              checked={weekly}
              label="Weekly"
              onChange={weekly ? this.setNever : this.setWeekly}
              value={formatMessage({ id: 'email.notification.weekly' })}
            />
          </li>
          <li className="email-notifications__list-item">
            <SwitchButton
              checked={never}
              label="Never"
              onChange={never ? this.setWeekly : this.setNever}
              value={formatMessage({ id: 'email.notification.never' })}
            />
          </li>
        </ul>
      </section>
    );
  }
}

EmailNotifications.propTypes = {
  intl: IntlPropType.isRequired
};

export default injectIntl(EmailNotifications);
