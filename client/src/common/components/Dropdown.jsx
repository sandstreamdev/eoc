import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { KeyCodes } from 'common/constants/enums';

class Dropdown extends PureComponent {
  subscription = undefined;

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };

    this.dropdown = React.createRef();
  }

  componentDidUpdate() {
    const { isVisible } = this.state;

    const unsubscribe = () => {
      document.removeEventListener('keydown', this.handleEscapePress, true);
      document.removeEventListener('click', this.handleClickOutside, true);

      this.subscription = undefined;
    };

    const subscribe = () => {
      document.addEventListener('keydown', this.handleEscapePress, true);
      document.addEventListener('click', this.handleClickOutside, true);

      return unsubscribe;
    };

    if (isVisible) {
      if (!this.subscription) {
        this.subscription = subscribe();
      }
    } else if (this.subscription) {
      this.subscription();
    }
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription();
    }
  }

  handleEscapePress = event => {
    const { code } = event;

    if (code === KeyCodes.ESCAPE) {
      this.setState({ isVisible: false });
    }
  };

  handleClickOutside = event => {
    const { isVisible } = this.state;
    const isClickedOutside = !this.dropdown.current.contains(event.target);

    if (isClickedOutside) {
      if (isVisible) {
        event.stopPropagation();
      }
      this.setState({ isVisible: false });
    }
  };

  showDropdown = () => this.setState({ isVisible: true });

  hideDropdown = () => this.setState({ isVisible: false });

  render() {
    const { isVisible } = this.state;
    const {
      buttonClassName,
      buttonContent,
      children,
      dropdownClassName,
      dropdownName
    } = this.props;

    return (
      <div className="dropdown">
        <button
          className={classNames(buttonClassName)}
          onClick={isVisible ? this.hideDropdown : this.showDropdown}
          type="button"
          title={
            dropdownName && `${isVisible ? 'Hide' : 'Show'} ${dropdownName}`
          }
        >
          {buttonContent}
        </button>
        {isVisible && (
          <div
            className={classNames('dropdown__wrapper', {
              [dropdownClassName]: dropdownClassName
            })}
            ref={this.dropdown}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
}

Dropdown.propTypes = {
  buttonClassName: PropTypes.string,
  buttonContent: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
    .isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  dropdownClassName: PropTypes.string,
  dropdownName: PropTypes.string
};

export default Dropdown;
