import React, { Component } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
// import PropTypes from 'prop-types';

import SwitchButton from 'common/components/SwitchButton';
import './EmailNotification.scss';
import { IntlPropType } from 'common/constants/propTypes';
import { saveEmailNotificationSettings } from '../model/actions';
import AlertBox from 'common/components/AlertBox';
import { MessageType } from 'common/constants/enums';

class EmailNotifications extends Component {
  state = {
    error: false,
    never: false,
    weekly: true
  };

  setWeekly = () =>
    this.setState(
      { weekly: true, never: false, error: false },
      this.updateNotificationSettings
    );

  setNever = () =>
    this.setState(
      { never: true, weekly: false, error: false },
      this.updateNotificationSettings
    );

  updateNotificationSettings = () => {
    const { weekly, never } = this.state;
    const settings = {
      never,
      weekly
    };

    try {
      console.log(settings);
      saveEmailNotificationSettings(settings);
    } catch {
      this.setState({ error: true });
    }
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const { error, weekly, never } = this.state;

    return (
      <section className="email-notifications">
        {error && (
          <AlertBox type={MessageType.ERROR}>
            <FormattedMessage id="email-notifications.save-settings-failure" />
          </AlertBox>
        )}
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
