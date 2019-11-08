/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import DOMPurify from 'dompurify';

import { getCurrentUser } from 'modules/user/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import './Policy.scss';

const Policy = ({ currentUser, policy }) => (
  <>
    <div
      className="policy"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(policy) }}
    />
    {!currentUser && (
      <div className="policy__login-link">
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
  policy: PropTypes.any
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(mapStateToProps)(Policy);
