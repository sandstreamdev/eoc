import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import AlertBox from 'common/components/AlertBox';
import SwitchButton from 'common/components/SwitchButton';
import { IntlPropType } from 'common/constants/propTypes';
import { saveEmailNotificationSettings } from '../model/actions';
import { MessageType } from 'common/constants/enums';
import './EmailNotification.scss';

class EmailNotifications extends PureComponent {
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
      saveEmailNotificationSettings(settings);
    } catch {
      this.setState({ error: true });
    }
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;
    const { error, never, weekly } = this.state;

    return (
      <section className="email-notifications">
        {error && (
          <AlertBox type={MessageType.ERROR}>
            <FormattedMessage id="email-notifications.save-settings-failure" />
            <span>&nbsp;</span>
            <FormattedMessage id="common.try-again" />
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
