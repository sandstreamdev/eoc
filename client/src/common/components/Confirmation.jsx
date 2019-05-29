import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';

const Confirmation = ({ className, disabled, onCancel, onConfirm, title }) => (
  <div className={classNames('confirmation', { className })}>
    <h4>{title}</h4>
    <PendingButton
      className="primary-button"
      disabled={disabled}
      onClick={onConfirm}
      preloaderTheme={PreloaderTheme.LIGHT}
      type="button"
    >
      Confirm
    </PendingButton>
    <button
      className="primary-button"
      disabled={disabled}
      onClick={onCancel}
      type="button"
    >
      Cancel
    </button>
  </div>
);

Confirmation.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default Confirmation;
