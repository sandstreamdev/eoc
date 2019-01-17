import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AuthBox from 'modules/legacy/AuthBox';
import App from 'modules/legacy/App';
import { setCurrentUser } from 'modules/legacy/mainActions';
import { UserPropType } from 'common/constants/propTypes';

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

    return currentUser ? <App /> : <AuthBox />;
  }
}

Auth.propTypes = {
  currentUser: UserPropType,

  setCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: state.currentUser
});

export default connect(
  mapStateToProps,
  { setCurrentUser }
)(Auth);
