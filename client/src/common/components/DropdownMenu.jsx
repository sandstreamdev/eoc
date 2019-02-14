import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import MenuIcon from 'assets/images/ellipsis-v-solid.svg';

class DropdownMenu extends Component {
  state = {
    hideMenu: true
  };

  hideMenu = () => {
    this.setState({ hideMenu: true });
    document.removeEventListener('click', this.hideMenu);
    document.removeEventListener('keydown', this.onPressEscape);
  };

  showMenu = () => {
    this.setState({ hideMenu: false });
    document.addEventListener('click', this.hideMenu);
    document.addEventListener('keydown', this.onPressEscape);
  };

  onPressEscape = e => (e.code === 'Escape' ? this.hideMenu() : null);

  toggleMenuVisibility = () => {
    const { hideMenu } = this.state;
    hideMenu ? this.showMenu() : this.hideMenu();
  };

  render() {
    const { hideMenu } = this.state;
    const { children, menuItems } = this.props;
    const menuButton = children || (
      <div className="dropdown__wrapper">
        <img alt="Menu Icon" className="dropdown__menu-icon" src={MenuIcon} />
      </div>
    );

    return (
      <div className="dropdown">
        <button
          className="dropdown__button"
          type="button"
          onClick={this.toggleMenuVisibility}
        >
          {menuButton}
        </button>
        <div
          className={classNames('dropdown__menu-wrapper', {
            hidden: hideMenu
          })}
        >
          <ul className="dropdown__menu">
            {menuItems.map(item => (
              <li className="dropdown__menu-item" key={item.label}>
                <button
                  className="dropdown__menu-button"
                  onClick={item.onClick}
                  type="button"
                >
                  {item.label}
                  {item.iconSrc && (
                    <img
                      alt={`${item.label} icon`}
                      className="dropdown__menu-icon"
                      src={item.iconSrc}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

DropdownMenu.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      iconSrc: PropTypes.string,
      label: PropTypes.string.isRequired,

      onClick: PropTypes.func.isRequired
    })
  ).isRequired
};

export default DropdownMenu;
