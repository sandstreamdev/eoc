import React, { Fragment, PureComponent } from 'react';
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

    this.pendingPromise = makeAbortablePromise(onClick());
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
      value
    } = this.props;

    return (
      <Fragment>
        <button
          className={classNames(className, {
            [`${className}--pending`]: pending
          })}
          disabled={pending || disabled}
          onClick={disabled ? null : this.handleOnClick}
          title={title}
          type="button"
          value={value}
        >
          {children}
        </button>
        {pending && <Preloader size={preloaderSize} theme={preloaderTheme} />}
      </Fragment>
    );
  }
}

PendingButton.defaultProps = {
  preloaderSize: PreloaderSize.SMALL,
  preloaderTheme: PreloaderTheme.DARK
};

PendingButton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  preloaderSize: PropTypes.string,
  preloaderTheme: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.string,

  onClick: PropTypes.func.isRequired
};

export default PendingButton;
