import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { KeyCodes } from 'common/constants/enums';

class Dropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false
    };

    this.dropdown = React.createRef();
  }

  componentDidUpdate(prevProps) {
    const { isVisible } = this.state;
    const {
      location: { pathname }
    } = this.props;
    const {
      location: { pathname: prevPathname }
    } = prevProps;

    if (isVisible) {
      document.addEventListener('keydown', this.handleEscapePress);
      document.addEventListener('click', this.handleClickOutside);
      document.addEventListener('touchend', this.handleClickOutside);
    } else {
      document.removeEventListener('keydown', this.handleEscapePress);
      document.removeEventListener('click', this.handleClickOutside);
      document.removeEventListener('touchend', this.handleClickOutside);
    }

    if (pathname !== prevPathname) {
      this.hideDropdown();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscapePress);
    document.removeEventListener('click', this.handleClickOutside);
  }

  hideDropdown = () => this.setState({ isVisible: false });

  showDropdown = () => this.setState({ isVisible: true });

  handleEscapePress = event => {
    const { code } = event;

    if (code === KeyCodes.ESCAPE) {
      this.hideDropdown();
    }
  };

  handleClickOutside = event => {
    const isClickedOutside = !this.dropdown.current.contains(event.target);

    if (isClickedOutside) {
      this.hideDropdown();
    }
  };

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
  dropdownName: PropTypes.string,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  })
};

export default withRouter(props => <Dropdown {...props} />);
