import React, { Component, Fragment } from 'react';

import AuthBox from './components/AuthBox';
import App from './components/App';
import { getCookie } from './common/utilites';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogged: !!getCookie('user_name')
    };
  }

  render() {
    const { isLogged } = this.state;

    return <Fragment>{isLogged ? <App /> : <AuthBox />}</Fragment>;
  }
}

export default Main;
