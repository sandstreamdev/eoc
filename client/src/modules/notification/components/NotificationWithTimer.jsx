import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Notification from './Notification';

class NotificationWithTimer extends PureComponent {
  constructor(props) {
    super(props);

    const { time } = this.props;

    this.state = {
      time
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
      const { time: prevTime } = this.state;

      if (prevTime <= 0) {
        return clearInterval(this.timer);
      }

      this.setState({ time: prevTime - 1 });
    }, 1000);
  };

  render() {
    const { id, redirect, type } = this.props;
    const { time } = this.state;

    return <Notification data={time} id={id} redirect={redirect} type={type} />;
  }
}

NotificationWithTimer.propTypes = {
  id: PropTypes.string.isRequired,
  redirect: PropTypes.bool,
  time: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired
};

export default NotificationWithTimer;
