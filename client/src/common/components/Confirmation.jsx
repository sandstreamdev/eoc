import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import PendingButton from 'common/components/PendingButton';
import { PreloaderTheme } from 'common/components/Preloader';

const Confirmation = ({
  children,
  className,
  confirmLabel,
  disabled,
  onCancel,
  onConfirm
}) => (
  <div className={classNames('confirmation', { className })}>
    <h4>{children}</h4>
    <PendingButton
      className="primary-button"
      disabled={disabled}
      onClick={onConfirm}
      preloaderTheme={PreloaderTheme.LIGHT}
      type="button"
    >
      <FormattedMessage id={confirmLabel || 'common.button.confirm'} />
    </PendingButton>
    <button
      className="primary-button"
      disabled={disabled}
      onClick={onCancel}
      type="button"
    >
      <FormattedMessage id="common.button.cancel" />
    </button>
  </div>
);

Confirmation.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  confirmLabel: PropTypes.string,
  disabled: PropTypes.bool,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default Confirmation;
