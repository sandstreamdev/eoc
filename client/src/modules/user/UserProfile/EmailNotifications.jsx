import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { saveEmailNotificationSettings, prepareReport } from '../model/actions';
import DaySelector from './DaySelector';
import './EmailNotification.scss';
import { EmailNotificationsFrequency } from 'common/constants/enums';
import { UserPropType } from 'common/constants/propTypes';

const emailNotificationsOptions = [
  { message: 'common.monday', value: EmailNotificationsFrequency.MONDAY },
  { message: 'common.tuesday', value: EmailNotificationsFrequency.TUESDAY },
  {
    message: 'common.wednesday',
    value: EmailNotificationsFrequency.WEDNESDAY
  },
  {
    message: 'common.thursday',
    value: EmailNotificationsFrequency.THURSDAY
  },
  { message: 'common.friday', value: EmailNotificationsFrequency.FRIDAY },
  {
    message: 'common.saturday',
    value: EmailNotificationsFrequency.SATURDAY
  },
  { message: 'common.sunday', value: EmailNotificationsFrequency.SUNDAY }
];

class EmailNotifications extends PureComponent {
  state = {
    emailNotificationsFrequency: null
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

  handleSetWeekly = () =>
    this.setState({
      emailNotificationsFrequency: EmailNotificationsFrequency.WEEKLY
    });

  handleSetNever = () =>
    this.setState(
      {
        emailNotificationsFrequency: EmailNotificationsFrequency.NEVER
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

  handleReports = () => {
    const { prepareReport } = this.props;

    prepareReport();
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
                emailNotificationsFrequency ===
                EmailNotificationsFrequency.NEVER
              }
              name="group1"
              onChange={this.handleSetNever}
              type="radio"
              value={EmailNotificationsFrequency.NEVER}
            />
          </label>
          <label className="email-notifications__label">
            <FormattedMessage id="email.notification.weekly" />
            <input
              checked={
                emailNotificationsFrequency !==
                EmailNotificationsFrequency.NEVER
              }
              name="group1"
              onChange={this.handleSetWeekly}
              type="radio"
              value={EmailNotificationsFrequency.WEEKLY}
            />
          </label>
          {emailNotificationsFrequency !==
            EmailNotificationsFrequency.NEVER && (
            <DaySelector
              onChange={this.handleSelect}
              options={emailNotificationsOptions}
              selected={emailNotificationsFrequency}
            />
          )}
          <label className="email-notifications__label">
            <FormattedMessage id="email-reports.items" />
            <button
              className="primary-button"
              onClick={this.handleReports}
              type="submit"
            >
              <FormattedMessage id="email-reports.submit-button" />
            </button>
          </label>
        </div>
      </section>
    );
  }
}

EmailNotifications.propTypes = {
  user: UserPropType.isRequired,

  prepareReport: PropTypes.func.isRequired,
  saveEmailNotificationSettings: PropTypes.func.isRequired
};

export default connect(
  null,
  { prepareReport, saveEmailNotificationSettings }
)(EmailNotifications);
