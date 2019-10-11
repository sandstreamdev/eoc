import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import AlertBox from 'common/components/AlertBox';
import { IntlPropType } from 'common/constants/propTypes';
import { saveEmailNotificationSettings } from '../model/actions';
import { NotificationFrequency, MessageType } from 'common/constants/enums';
import './EmailNotification.scss';

class EmailNotifications extends PureComponent {
  state = {
    success: false,
    error: false,
    notificationFrequency: NotificationFrequency.MONDAY,
    areDaysVisible: true
  };

  showDays = () =>
    this.setState({
      areDaysVisible: true,
      notificationFrequency: NotificationFrequency.MONDAY
    });

  showSuccessMessage = () => {
    this.setState({ success: true }, this.hideSuccessMessageAfterTimeout);
  };

  hideSuccessMessageAfterTimeout = () =>
    setTimeout(() => this.setState({ success: false }), 4000);

  handleSetNever = () =>
    this.setState(
      {
        areDaysVisible: false,
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
    const {
      intl: { formatMessage }
    } = this.props;
    const {
      areDaysVisible,
      error,
      notificationFrequency,
      success
    } = this.state;

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
              onChange={this.showDays}
            />
          </label>
          {areDaysVisible && (
            <div className="email-notifications__days">
              <select
                className="email-notifications__select"
                onChange={this.handleSelect}
              >
                <option value={NotificationFrequency.MONDAY}>
                  {formatMessage({ id: 'common.monday' })}
                </option>
                <option value={NotificationFrequency.TUESDAY}>
                  {formatMessage({ id: 'common.tuesday' })}
                </option>
                <option value={NotificationFrequency.WEDNESDAY}>
                  {formatMessage({ id: 'common.wednesday' })}
                </option>
                <option value={NotificationFrequency.THURSDAY}>
                  {formatMessage({ id: 'common.thursday' })}
                </option>
                <option value={NotificationFrequency.FRIDAY}>
                  {formatMessage({ id: 'common.friday' })}
                </option>
                <option value={NotificationFrequency.SATURDAY}>
                  {formatMessage({ id: 'common.saturday' })}
                </option>
                <option value={NotificationFrequency.SUNDAY}>
                  {formatMessage({ id: 'common.sunday' })}
                </option>
              </select>
            </div>
          )}
        </div>
      </section>
    );
  }
}

EmailNotifications.propTypes = {
  intl: IntlPropType.isRequired
};

export default injectIntl(EmailNotifications);
