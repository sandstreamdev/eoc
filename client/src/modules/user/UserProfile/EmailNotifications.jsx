import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { saveEmailNotificationSettings } from '../model/actions';
import DaySelector from './DaySelector';
import './EmailNotification.scss';
import { EmailNotificationFrequency } from 'common/constants/enums';
import { UserPropType } from 'common/constants/propTypes';

const emailNotificationsOptions = [
  { message: 'common.monday', value: EmailNotificationFrequency.MONDAY },
  { message: 'common.tuesday', value: EmailNotificationFrequency.TUESDAY },
  {
    message: 'common.wednesday',
    value: EmailNotificationFrequency.WEDNESDAY
  },
  {
    message: 'common.thursday',
    value: EmailNotificationFrequency.THURSDAY
  },
  { message: 'common.friday', value: EmailNotificationFrequency.FRIDAY },
  {
    message: 'common.saturday',
    value: EmailNotificationFrequency.SATURDAY
  },
  { message: 'common.sunday', value: EmailNotificationFrequency.SUNDAY }
];

class EmailNotifications extends PureComponent {
  state = {
    emailNotificationsFrequency: ''
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

    this.setState({ emailNotificationsFrequency });
  };

  setWeekly = () =>
    this.setState({
      emailNotificationsFrequency: EmailNotificationFrequency.WEEKLY
    });

  handleSetNever = () =>
    this.setState(
      {
        emailNotificationsFrequency: EmailNotificationFrequency.NEVER
      },
      this.updateNotificationSettings
    );

  handleSelect = event => {
    const {
      target: { value }
    } = event;

    this.setState(
      { emailNotificationsFrequency: value },
      this.updateNotificationSettings
    );
  };

  updateNotificationSettings = () => {
    const { emailNotificationsFrequency } = this.state;
    const { saveEmailNotificationSettings } = this.props;

    saveEmailNotificationSettings(emailNotificationsFrequency);
  };

  render() {
    const { emailNotificationsFrequency } = this.state;

    return (
      <section className="email-notifications">
        <h2 className="email-notifications__heading">
          <FormattedMessage id="email.notification.heading" />
        </h2>
        <div className="email-notifications__body">
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.never" />
            <input
              checked={
                emailNotificationsFrequency === EmailNotificationFrequency.NEVER
              }
              name="group1"
              type="radio"
              value={EmailNotificationFrequency.NEVER}
              onChange={this.handleSetNever}
            />
          </label>
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.weekly" />
            <input
              checked={
                emailNotificationsFrequency !== EmailNotificationFrequency.NEVER
              }
              name="group1"
              type="radio"
              value={EmailNotificationFrequency.WEEKLY}
              onChange={this.setWeekly}
            />
          </label>
          {emailNotificationsFrequency !== EmailNotificationFrequency.NEVER && (
            <DaySelector
              onChange={this.handleSelect}
              options={emailNotificationsOptions}
              selected={emailNotificationsFrequency}
            />
          )}
        </div>
      </section>
    );
  }
}

EmailNotifications.propTypes = {
  user: UserPropType.isRequired,

  saveEmailNotificationSettings: PropTypes.func.isRequired
};

export default connect(
  null,
  { saveEmailNotificationSettings }
)(EmailNotifications);
