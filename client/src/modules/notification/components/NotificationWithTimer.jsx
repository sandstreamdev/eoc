import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Notification from './Notification';
import { REDIRECT_TIMEOUT } from 'common/constants/variables/';

class NotificationWithTimer extends PureComponent {
  constructor(props) {
    super(props);

    this.timer = null;
    this.state = {
      timeout: REDIRECT_TIMEOUT / 1000
    };
  }

  componentDidMount() {
    this.createInterval();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  createInterval = () => {
    this.timer = setInterval(() => {
      const { timeout: prevTimeout } = this.state;

      if (prevTimeout <= 0) {
        return clearInterval(this.timer);
      }

      this.setState({ timeout: prevTimeout - 1 });
    }, 1000);
  };

  render() {
    const { id, redirect, type } = this.props;
    const { timeout } = this.state;

    return (
      <Notification data={timeout} id={id} redirect={redirect} type={type} />
    );
  }
}

NotificationWithTimer.propTypes = {
  id: PropTypes.string.isRequired,
  redirect: PropTypes.bool,
  type: PropTypes.string.isRequired
};

export default NotificationWithTimer;
