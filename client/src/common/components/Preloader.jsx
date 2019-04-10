import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const PreloaderTheme = {
  DARK: 'preloader/DARK',
  LIGHT: 'preloader/LIGHT'
};

const Preloader = ({ message, theme = PreloaderTheme.DARK }) => (
  <div className="preloader">
    <div className="preloader__spinner">
      <div
        className={classNames('preloader__shape1', {
          'preloader__shape--dark': theme === PreloaderTheme.DARK,
          'preloader__shape--light': theme === PreloaderTheme.LIGHT
        })}
      />
      <div className="preloader__shape2" />
    </div>
    <span className="preloader__text">{message}</span>
  </div>
);

Preloader.propTypes = {
  message: PropTypes.string,
  theme: PropTypes.string
};

export default Preloader;
