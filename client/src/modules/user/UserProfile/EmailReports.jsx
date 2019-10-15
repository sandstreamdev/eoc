import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import './EmailReports.scss';
import { prepareReport } from '../model/actions';

class SendEmailReports extends PureComponent {
  handleReports = async () => {
    const { prepareReport } = this.props;

    prepareReport();
  };

  render() {
    return (
      <section className="email-reports">
        <h2 className="email-reports__heading">
          <FormattedMessage id="email-reports.heading" />
        </h2>
        <ul className="email-reports__list">
          <li className="email-reports__list-item">
            <FormattedMessage id="email-reports.items" />
            <button
              className="primary-button"
              onClick={this.handleReports}
              type="submit"
            >
              <FormattedMessage id="email-reports.submit-button" />
            </button>
          </li>
        </ul>
      </section>
    );
  }
}

SendEmailReports.propTypes = {
  prepareReport: PropTypes.func.isRequired
};

export default connect(
  null,
  { prepareReport }
)(SendEmailReports);
