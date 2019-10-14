import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import { saveEmailNotificationSettings } from '../model/actions';
import DaySelector from './DaySelector';
import './EmailNotification.scss';
import AlertBox from 'common/components/AlertBox';
import { NotificationFrequency, MessageType } from 'common/constants/enums';
import { UserPropType } from 'common/constants/propTypes';

class EmailNotifications extends PureComponent {
  state = {
    success: false,
    error: false,
    notificationFrequency: ''
  };

  componentDidMount() {
    this.getUserSettings();
  }

  componentDidUpdate(previousProps) {
    const {
      user: { emailNotificationsFrequency: currentSettings }
    } = this.props;
    const {
      user: { emailNotificationsFrequency: previousSettings }
    } = previousProps;

    if (currentSettings !== previousSettings) {
      this.getUserSettings();
    }
  }

  getUserSettings = () => {
    const {
      user: { emailNotificationsFrequency }
    } = this.props;

    this.setState({ notificationFrequency: emailNotificationsFrequency });
  };

  setWeekly = () =>
    this.setState({
      notificationFrequency: NotificationFrequency.WEEKLY
    });

  showSuccessMessage = () => {
    this.setState({ success: true }, this.hideSuccessMessageAfterTimeout);
  };

  hideSuccessMessageAfterTimeout = () =>
    setTimeout(() => this.setState({ success: false }), 4000);

  handleSetNever = () =>
    this.setState(
      {
        notificationFrequency: NotificationFrequency.NEVER
      },
      this.updateNotificationSettings
    );

  handleSelect = event => {
    const {
      target: { value }
    } = event;

    this.setState(
      { notificationFrequency: value },
      this.updateNotificationSettings
    );
  };

  updateNotificationSettings = async () => {
    const { notificationFrequency } = this.state;

    this.setState({ error: false });

    try {
      const result = await saveEmailNotificationSettings(notificationFrequency);

      if (result) {
        this.showSuccessMessage();
      }
    } catch {
      this.setState({ error: true });
    }
  };

  render() {
    const { error, notificationFrequency, success } = this.state;

    return (
      <section className="email-notifications">
        {error && (
          <AlertBox type={MessageType.ERROR}>
            <FormattedMessage id="email-notifications.save-settings-failure" />
            <span>&nbsp;</span>
            <FormattedMessage id="common.try-again" />
          </AlertBox>
        )}
        {success && (
          <AlertBox type={MessageType.SUCCESS}>
            <FormattedMessage id="email-notifications.save-settings-success" />
          </AlertBox>
        )}
        <h2 className="email-notifications__heading">
          <FormattedMessage id="email.notification.heading" />
        </h2>
        <div className="email-notifications__body">
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.never" />
            <input
              checked={notificationFrequency === NotificationFrequency.NEVER}
              name="group1"
              type="radio"
              value={NotificationFrequency.NEVER}
              onChange={this.handleSetNever}
            />
          </label>
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.weekly" />
            <input
              checked={notificationFrequency !== NotificationFrequency.NEVER}
              name="group1"
              type="radio"
              value={NotificationFrequency.WEEKLY}
              onChange={this.setWeekly}
            />
          </label>
          {notificationFrequency !== NotificationFrequency.NEVER && (
            <DaySelector
              onChange={this.handleSelect}
              selected={notificationFrequency}
            />
          )}
        </div>
      </section>
    );
  }
}

EmailNotifications.propTypes = {
  user: UserPropType.isRequired
};

export default EmailNotifications;
