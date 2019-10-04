import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import FocusLock from 'react-focus-lock';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import Preloader from 'common/components/Preloader';
import { enumerable } from 'common/utils/helpers';
import './Dialog.scss';

export const DialogContext = enumerable('dialog')(
  'ARCHIVE',
  'CREATE',
  'DISABLE',
  'UPDATE'
);

const Dialog = ({
  cancelLabel,
  children,
  confirmLabel,
  hasPermissions,
  onCancel,
  onConfirm,
  pending,
  title
}) => (
  <Fragment>
    <Overlay type={OverlayStyleType.MEDIUM} />
    <div className="dialog">
      <FocusLock returnFocus>
        <header className="dialog__header">
          <h2 className="dialog__heading">{title && title}</h2>
        </header>
        <div className="dialog__body">
          {children && <div className="dialog__children">{children}</div>}
          <div className="dialog__footer">
            {hasPermissions && onConfirm && (
              <button
                className="dialog__button primary-button"
                disabled={pending}
                onClick={onConfirm}
                type="button"
              >
                <FormattedMessage id={confirmLabel} />
              </button>
            )}
            <button
              className="dialog__button outline-button"
              disabled={pending}
              onClick={onCancel}
              type="button"
            >
              <FormattedMessage id={cancelLabel} />
            </button>
          </div>
          {pending && <Preloader />}
        </div>
      </FocusLock>
    </div>
  </Fragment>
);

Dialog.defaultProps = {
  cancelLabel: 'common.button.cancel',
  confirmLabel: 'common.button.confirm',
  hasPermissions: true
};

Dialog.propTypes = {
  cancelLabel: PropTypes.string,
  children: PropTypes.node,
  confirmLabel: PropTypes.string,
  hasPermissions: PropTypes.bool,
  pending: PropTypes.bool,
  title: PropTypes.string,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func
};

export default Dialog;
