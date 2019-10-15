import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { saveEmailReportsSettings } from '../model/actions';
import DaySelector from './DaySelector';
import './EmailReports.scss';
import { EmailReportsFrequency } from 'common/constants/enums';
import { UserPropType } from 'common/constants/propTypes';

const emailNotificationsOptions = [
  { message: 'common.monday', value: EmailReportsFrequency.MONDAY },
  { message: 'common.tuesday', value: EmailReportsFrequency.TUESDAY },
  {
    message: 'common.wednesday',
    value: EmailReportsFrequency.WEDNESDAY
  },
  {
    message: 'common.thursday',
    value: EmailReportsFrequency.THURSDAY
  },
  { message: 'common.friday', value: EmailReportsFrequency.FRIDAY },
  {
    message: 'common.saturday',
    value: EmailReportsFrequency.SATURDAY
  },
  { message: 'common.sunday', value: EmailReportsFrequency.SUNDAY }
];

class EmailNotifications extends PureComponent {
  state = {
    emailReportsFrequency: EmailReportsFrequency.NEVER
  };

  componentDidMount() {
    this.getUserSettings();
  }

  componentDidUpdate(previousProps) {
    const {
      user: { emailReportsFrequency: currentSettings }
    } = this.props;
    const {
      user: { emailReportsFrequency: previousSettings }
    } = previousProps;

    if (currentSettings !== previousSettings) {
      this.getUserSettings();
    }
  }

  getUserSettings = () => {
    const {
      user: { emailReportsFrequency }
    } = this.props;

    this.setState({ emailReportsFrequency });
  };

  handleSetWeekly = () =>
    this.setState({
      emailReportsFrequency: EmailReportsFrequency.WEEKLY
    });

  handleSetNever = () =>
    this.setState(
      {
        emailReportsFrequency: EmailReportsFrequency.NEVER
      },
      this.updateNotificationSettings
    );

  handleSelect = event => {
    const {
      target: { value }
    } = event;

    this.setState(
      { emailReportsFrequency: value },
      this.updateNotificationSettings
    );
  };

  updateNotificationSettings = () => {
    const { emailReportsFrequency } = this.state;
    const { saveEmailReportsSettings } = this.props;

    console.log(emailReportsFrequency);
    saveEmailReportsSettings(emailReportsFrequency);
  };

  render() {
    const { emailReportsFrequency } = this.state;
    const sendNever = emailReportsFrequency === EmailReportsFrequency.NEVER;
    const sendWeekly = emailReportsFrequency !== EmailReportsFrequency.NEVER;

    return (
      <section className="email-notifications">
        <h2 className="email-notifications__heading">
          <FormattedMessage id="email.reports.heading" />
        </h2>
        <div className="email-notifications__body">
          <label className="email-notifications__label">
            <FormattedMessage id="email.reports.never" />
            <input
              checked={sendNever}
              name="group1"
              onChange={this.handleSetNever}
              type="radio"
              value={EmailReportsFrequency.NEVER}
            />
          </label>
          <label className="email-notifications__label">
            <FormattedMessage id="email.reports.weekly" />
            <input
              checked={sendWeekly}
              name="group1"
              onChange={this.handleSetWeekly}
              type="radio"
              value={EmailReportsFrequency.WEEKLY}
            />
          </label>
          {sendWeekly && (
            <DaySelector
              onChange={this.handleSelect}
              options={emailNotificationsOptions}
              selected={emailReportsFrequency}
            />
          )}
        </div>
      </section>
    );
  }
}

EmailNotifications.propTypes = {
  user: UserPropType.isRequired,

  saveEmailReportsSettings: PropTypes.func.isRequired
};

export default connect(
  null,
  { saveEmailReportsSettings }
)(EmailNotifications);
