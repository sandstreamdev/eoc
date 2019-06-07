import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { BellIcon } from 'assets/images/icons';
import { KeyCodes } from 'common/constants/enums';

class Activities extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };

    this.activities = React.createRef();
  }

  componentDidUpdate() {
    const { isVisible } = this.state;

    if (isVisible) {
      document.addEventListener('keydown', this.handleEscapePress);
      document.addEventListener('click', this.handleClickOutside);
    } else {
      document.removeEventListener('keydown', this.handleEscapePress);
      document.removeEventListener('click', this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscapePress);
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleEscapePress = event => {
    const { code } = event;

    if (code === KeyCodes.ESCAPE) {
      this.setState({
        isVisible: false
      });
    }
  };

  handleClickOutside = event => {
    const isClickedOutside = !this.activities.current.contains(event.target);

    if (isClickedOutside) {
      this.setState({ isVisible: false });
    }
  };

  handleActivitiesVisibility = () =>
    this.setState(({ isVisible }) => ({ isVisible: !isVisible }));

  render() {
    const { isVisible } = this.state;

    return (
      <div className="activities">
        <button
          className={classNames('activities__button', {
            'z-index-high': isVisible
          })}
          onClick={this.handleActivitiesVisibility}
          type="button"
        >
          <BellIcon />
        </button>
        <div
          className={classNames('activities__wrapper z-index-high', {
            hidden: !isVisible
          })}
          ref={this.activities}
        >
          <ul className="activities__menu">
            <li className="activities__menu-item">My cohorts</li>
            <li className="activities__menu-item">Logout</li>
          </ul>
        </div>
      </div>
    );
  }
}

Activities.propTypes = {};

export default Activities;
