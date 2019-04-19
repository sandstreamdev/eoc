import React, { PureComponent } from 'react';
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

class Preloader extends PureComponent {
  constructor(props) {
    super(props);

    this.state = { displayAnimation: false };
    this.timer = setTimeout(this.enableAnimation, 250);
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
