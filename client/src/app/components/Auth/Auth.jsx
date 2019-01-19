import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

// import App from '../App';
import AuthBox from 'modules/legacy/AuthBox';
import { setCurrentUser } from 'modules/legacy/mainActions';
import { UserPropType } from 'common/constants/propTypes';
import AppLogo from 'modules/legacy/AppLogo';
import { ENDPOINT_URL } from 'common/constants/variables';

class Auth extends Component {
  componentDidMount() {
    this.setAuthenticationState();
  }

  setAuthenticationState = () => {
    const { setCurrentUser } = this.props;

    setCurrentUser();
  };

  render() {
    const { currentUser } = this.props;

    if (currentUser) {
      return <Redirect to="/dashboard" />;
    }

    return <AuthBox />;
  }
}

Auth.propTypes = {
  currentUser: UserPropType.isRequired,

  setCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: state.currentUser
});

export default connect(
  mapStateToProps,
  { setCurrentUser }
)(Auth);
