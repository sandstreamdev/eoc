import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';
import classNames from 'classnames';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import Preloader from 'common/components/Preloader';
import { enumerable } from 'common/utils/helpers';
import { MessageType } from 'common/constants/enums';
import './Dialog.scss';

export const DialogContext = enumerable('dialog')(
  'ARCHIVE',
  'CREATE',
  'DISABLE',
  'UPDATE'
);

const Dialog = ({
  buttonStyleType,
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
                className={classNames('dialog__button primary-button', {
                  'danger-button': buttonStyleType === MessageType.ERROR
                })}
                disabled={pending}
                onClick={onConfirm}
                type="button"
              >
                {confirmLabel}
              </button>
            )}
            <button
              className="dialog__button outline-button"
              disabled={pending}
              onClick={onCancel}
              type="button"
            >
              {cancelLabel}
            </button>
          </div>
          {pending && <Preloader />}
        </div>
      </FocusLock>
    </div>
  </Fragment>
);

Dialog.defaultProps = {
  cancelLabel: 'cancel',
  confirmLabel: 'confirm',
  hasPermissions: true
};

Dialog.propTypes = {
  buttonStyleType: PropTypes.string,
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
