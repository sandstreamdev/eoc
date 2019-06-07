import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { KeyCodes } from 'common/constants/enums';

class Dropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };

    this.dropdown = React.createRef();
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
    const isClickedOutside = !this.dropdown.current.contains(event.target);

    if (isClickedOutside) {
      this.setState({ isVisible: false });
    }
  };

  handleDropdownVisibility = () =>
    this.setState(({ isVisible }) => ({ isVisible: !isVisible }));

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
          onClick={this.handleDropdownVisibility}
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
