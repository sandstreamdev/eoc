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

      if (pathname !== prevPathname) {
        this.hide();
      }
    } else {
      document.removeEventListener('keydown', this.handleEscapePress);
      document.removeEventListener('click', this.handleClickOutside);
      document.removeEventListener('touchend', this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscapePress);
    document.removeEventListener('click', this.handleClickOutside);
  }

  setVisibility = isVisible => this.setState({ isVisible });

  hide = () => this.setVisibility(false);

  show = () => this.setVisibility(true);

  handleEscapePress = event => {
    const { code } = event;

    if (code === KeyCodes.ESCAPE) {
      this.hide();
    }
  };

  handleClickOutside = event => {
    const isClickedOutside = !this.dropdown.current.contains(event.target);

    if (isClickedOutside) {
      this.hide();
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
    const toggle = isVisible ? this.hide : this.show;

    return (
      <div className="dropdown">
        <button
          className={classNames(buttonClassName)}
          onClick={toggle}
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
  }).isRequired
};

export default withRouter(Dropdown);
