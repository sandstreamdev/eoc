import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const OverlayStyleType = {
  LIGHT: 'overlay/LIGHT',
  DARK: 'overlay/DARK',
  MEDIUM: 'overlay/MEDIUM'
};

class Overlay extends PureComponent {
  componentDidMount() {
    document.addEventListener('keydown', this.escapeListener);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.escapeListener);
  }

  onEvent = () => {
    const { onVisbilityChange } = this.props;

    onVisbilityChange(false);
  };

  escapeListener = event => {
    const { code } = event;
    if (code === 'Escape') {
      this.onEvent();
    }
  };

  render() {
    const { children, type } = this.props;

    return (
      <div
        className={classNames('overlay', {
          'overlay--light': type === OverlayStyleType.LIGHT,
          'overlay--dark': type === OverlayStyleType.DARK,
          'overlay--medium': type === OverlayStyleType.MEDIUM
        })}
        onClick={this.onEvent}
        role="banner"
      >
        {children}
      </div>
    );
  }
}

Overlay.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string.isRequired,

  onVisbilityChange: PropTypes.func.isRequired
};

export default Overlay;
