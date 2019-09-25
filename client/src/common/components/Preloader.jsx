import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { PENDING_DELAY } from 'common/constants/variables';
import './Preloader.scss';

export const PreloaderTheme = {
  DARK: 'preloader/DARK',
  LIGHT: 'preloader/LIGHT',
  GOOGLE: 'preloader/GOOGLE'
};

export const PreloaderSize = {
  BIG: 'preloader/BIG',
  SMALL: 'preloader/SMALL'
};

class Preloader extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { displayAnimation: false };
  }

  componentDidMount() {
    this.timer = setTimeout(this.enableAnimation, PENDING_DELAY);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  enableAnimation = () => this.setState({ displayAnimation: true });

  render() {
    const { message, size, theme } = this.props;
    const { displayAnimation } = this.state;

    if (!displayAnimation) {
      return null;
    }

    return (
      <div
        className={classNames('preloader', {
          'preloader--dark': theme === PreloaderTheme.DARK,
          'preloader--light': theme === PreloaderTheme.LIGHT,
          'preloader--google': theme === PreloaderTheme.GOOGLE
        })}
      >
        <div className="preloader-wrapper">
          <div
            className={classNames('preloader__spinner', {
              'preloader__spinner--small': size === PreloaderSize.SMALL,
              'preloader__spinner--big': size === PreloaderSize.BIG
            })}
          >
            <div
              className={classNames('preloader__spinner1', {
                'preloader__spinner1--dark': theme === PreloaderTheme.DARK,
                'preloader__spinner1--light': theme === PreloaderTheme.LIGHT,
                'preloader__spinner1--google': theme === PreloaderTheme.GOOGLE
              })}
            />
            <div
              className={classNames('preloader__spinner2', {
                'preloader__spinner2--dark': theme === PreloaderTheme.DARK,
                'preloader__spinner2--light': theme === PreloaderTheme.LIGHT,
                'preloader__spinner2--google': theme === PreloaderTheme.GOOGLE
              })}
            />
          </div>
          <span className="preloader__text">{message}</span>
        </div>
      </div>
    );
  }
}

Preloader.defaultProps = {
  size: PreloaderSize.BIG,
  theme: PreloaderTheme.DARK
};

Preloader.propTypes = {
  message: PropTypes.string,
  size: PropTypes.string,
  theme: PropTypes.string
};

export default Preloader;
