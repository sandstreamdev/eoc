import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const PreloaderTheme = {
  DARK: 'preloader/DARK',
  LIGHT: 'preloader/LIGHT'
};

export const PreloaderSize = {
  BIG: 'preloader/BIG',
  SMALL: 'preloader/SMALL'
};

const Preloader = ({
  message,
  size = PreloaderSize.BIG,
  theme = PreloaderTheme.DARK
}) => (
  <div className="preloader">
    <div
      className={classNames('preloader__spinner', {
        'preloader__spinner--small': size === PreloaderSize.SMALL,
        'preloader__spinner--big': size === PreloaderSize.BIG
      })}
    >
      <div
        className={classNames('preloader__shape1', {
          'preloader__shape1--dark': theme === PreloaderTheme.DARK,
          'preloader__shape1--light': theme === PreloaderTheme.LIGHT
        })}
      />
      <div
        className={classNames('preloader__shape2', {
          'preloader__shape2--dark': theme === PreloaderTheme.DARK,
          'preloader__shape2--light': theme === PreloaderTheme.LIGHT
        })}
      />
    </div>
    <span className="preloader__text">{message}</span>
  </div>
);

Preloader.propTypes = {
  message: PropTypes.string,
  size: PropTypes.string,
  theme: PropTypes.string
};

export default Preloader;
