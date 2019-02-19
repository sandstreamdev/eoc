import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const OverlayStyleType = {
  LIGHT: 'overlay/LIGHT',
  DARK: 'overlay/DARK',
  MEDIUM: 'overlay/MEDIUM'
};

const Overlay = ({ children, onClick, type }) => (
  <div
    className={classNames('overlay', {
      'overlay--light': type === OverlayStyleType.LIGHT,
      'overlay--dark': type === OverlayStyleType.DARK,
      'overlay--medium': type === OverlayStyleType.MEDIUM
    })}
    onClick={onClick}
    role="banner"
  >
    {children}
  </div>
);

Overlay.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string.isRequired,

  onClick: PropTypes.func
};

export default Overlay;
