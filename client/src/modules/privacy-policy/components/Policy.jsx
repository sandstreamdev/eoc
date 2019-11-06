/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { getCurrentUser } from 'modules/user/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import './Policy.scss';

const Policy = ({ currentUser, dangerouslySetInnerHTML }) => (
  <>
    <div className="policy" dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
    {!currentUser && (
      <div className="privacy-policy__links">
        <Link to="/">
          <button className="primary-button" type="button">
            <FormattedMessage id="privacy-policy.index.login-btn" />
          </button>
        </Link>
      </div>
    )}
  </>
);

Policy.propTypes = {
  currentUser: UserPropType,
  dangerouslySetInnerHTML: PropTypes.any
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(mapStateToProps)(Policy);
