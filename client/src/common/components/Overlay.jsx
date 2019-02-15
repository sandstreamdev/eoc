import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const OverlayStyleType = {
  LIGHT: 'overlay/LIGHT',
  DARK: 'overlay/DARK',
  MEDIUM: 'overlay/MEDIUM'
};

const Overlay = ({ children, type }) => (
  <div
    className={classNames('overlay', {
      'overlay--light': type === OverlayStyleType.LIGHT,
      'overlay--dark': type === OverlayStyleType.DARK,
      'overlay--medium': type === OverlayStyleType.MEDIUM
    })}
  >
    {children}
  </div>
);

Overlay.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string.isRequired
};

export default Overlay;
