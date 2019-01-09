import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AuthBox from '../AuthBox';
import App from '../App';
import { getCookie } from '../../utils/cookie';
import { fetchCurrentUser } from './actions';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: null
    };

    this.checkIfAuthenticated();
  }

  componentDidMount() {
    this.setState({
      isLogged: !!getCookie('user')
    });
  }

  checkIfAuthenticated = () => {
    const { fetchCurrentUser } = this.props;

    fetchCurrentUser();
  };

  render() {
    const { isLogged } = this.state;

    return isLogged ? <App /> : <AuthBox />;
  }
}

Main.propTypes = {
  fetchCurrentUser: PropTypes.func.isRequired
};

export default connect(
  null,
  { fetchCurrentUser }
)(Main);
