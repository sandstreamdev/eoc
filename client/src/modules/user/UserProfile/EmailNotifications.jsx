import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import AlertBox from 'common/components/AlertBox';
import { IntlPropType } from 'common/constants/propTypes';
import { saveEmailNotificationSettings } from '../model/actions';
import { NotificationFrequency, MessageType } from 'common/constants/enums';
import './EmailNotification.scss';

class EmailNotifications extends PureComponent {
  state = {
    error: false,
    notificationFrequency: NotificationFrequency.MONDAY,
    areDaysVisible: false
  };

  handleDaysVisibility = () => this.setState({ areDaysVisible: true });

  setWeekly = event => {
    this.setState({ notificationFrequency: NotificationFrequency.MONDAY });
  };

  setNever = () =>
    this.setState({
      areDaysVisible: false,
      notificationFrequency: NotificationFrequency.NEVER
    });

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
    const { areDaysVisible, error, notificationFrequency } = this.state;

    console.log(notificationFrequency, NotificationFrequency.NEVER);

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
        <div className="email-notifications__body">
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.never" />
            <input
              // checked={notificationFrequency === NotificationFrequency.NEVER}
              name="group1"
              type="radio"
              value={formatMessage({ id: 'email.notification.never' })}
              // onInput={this.handleChange}
              onChange={this.setNever}
            />
          </label>
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.weekly" />
            <input
              //  checked={notificationFrequency !== NotificationFrequency.NEVER}
              name="group1"
              type="radio"
              value={formatMessage({ id: 'email.notification.weekly' })}
              // onInput={this.handleChange}
              onChange={this.handleDaysVisibility}
            />
          </label>
          {areDaysVisible && (
            <div className="email-notifications__days">
              <select>
                <option value={formatMessage({ id: 'common.monday' })}>
                  {formatMessage({ id: 'common.monday' })}
                </option>
                <option value={formatMessage({ id: 'common.tuesday' })}>
                  {formatMessage({ id: 'common.tuesday' })}
                </option>
                <option value={formatMessage({ id: 'common.wednesday' })}>
                  {formatMessage({ id: 'common.wednesday' })}
                </option>
                <option value={formatMessage({ id: 'common.thursday' })}>
                  {formatMessage({ id: 'common.thursday' })}
                </option>
                <option value={formatMessage({ id: 'common.friday' })}>
                  {formatMessage({ id: 'common.friday' })}
                </option>
                <option value={formatMessage({ id: 'common.saturday' })}>
                  {formatMessage({ id: 'common.saturday' })}
                </option>
                <option value={formatMessage({ id: 'common.sunday' })}>
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
