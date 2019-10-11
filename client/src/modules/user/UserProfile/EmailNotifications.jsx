import React, { PureComponent } from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';

import AlertBox from 'common/components/AlertBox';
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
        <div className="email-notifications__body">
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.never" />
            <input
              checked={never}
              name="group1"
              type="radio"
              value={formatMessage({ id: 'email.notification.never' })}
              onChange={never ? this.setWeekly : this.setNever}
            />
          </label>
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.weekly" />
            <input
              checked={weekly}
              name="group1"
              type="radio"
              value={formatMessage({ id: 'email.notification.weekly' })}
              onChange={weekly ? this.setNever : this.setWeekly}
            />
          </label>
          {weekly && (
            <div className="email-notifications__days">
              <label className="email-notifications__label">
                <FormattedMessage id="common.monday" />
                <input
                  name="group2"
                  type="radio"
                  value={formatMessage({ id: 'common.monday' })}
                />
              </label>
              <label className="email-notifications__label">
                <FormattedMessage id="common.tuesday" />
                <input
                  name="group2"
                  type="radio"
                  value={formatMessage({ id: 'common.tuesday' })}
                />
              </label>
              <label className="email-notifications__label">
                <FormattedMessage id="common.wednesday" />
                <input
                  name="group2"
                  type="radio"
                  value={formatMessage({ id: 'common.wednesday' })}
                />
              </label>
              <label className="email-notifications__label">
                <FormattedMessage id="common.thursday" />
                <input
                  name="group2"
                  type="radio"
                  value={formatMessage({ id: 'common.thursday' })}
                />
              </label>
              <label className="email-notifications__label">
                <FormattedMessage id="common.friday" />
                <input
                  name="group2"
                  type="radio"
                  value={formatMessage({ id: 'common.friday' })}
                />
              </label>
              <label className="email-notifications__label">
                <FormattedMessage id="common.saturday" />
                <input
                  name="group2"
                  type="radio"
                  value={formatMessage({ id: 'common.saturday' })}
                />
              </label>
              <label className="email-notifications__label">
                <FormattedMessage id="common.sunday" />
                <input
                  name="group2"
                  type="radio"
                  value={formatMessage({ id: 'common.sunday' })}
                />
              </label>
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
