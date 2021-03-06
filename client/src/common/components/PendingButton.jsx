/* eslint-disable react/button-has-type */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';

class PendingButton extends PureComponent {
  pendingPromise = null;

  state = {
    pending: false
  };

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  handleOnClick = event => {
    event.stopPropagation();
    const { onClick } = this.props;

    this.setState({ pending: true });

    this.pendingPromise = makeAbortablePromise(onClick(event));
    this.pendingPromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pending: false });
        }
      });
  };

  render() {
    const { pending } = this.state;
    const {
      children,
      className,
      disabled,
      preloaderSize,
      preloaderTheme,
      title,
      type,
      value
    } = this.props;

    return (
      <>
        <button
          className={classNames(className, {
            [`${className}--pending`]: pending
          })}
          disabled={disabled || pending}
          onClick={disabled || pending ? null : this.handleOnClick}
          title={title}
          type={type}
          value={value}
        >
          {children}
          {pending && <Preloader size={preloaderSize} theme={preloaderTheme} />}
        </button>
      </>
    );
  }
}

PendingButton.defaultProps = {
  preloaderSize: PreloaderSize.SMALL,
  preloaderTheme: PreloaderTheme.DARK,
  type: 'button'
};

PendingButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  preloaderSize: PropTypes.string,
  preloaderTheme: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,

  onClick: PropTypes.func.isRequired
};

export default PendingButton;
