import React from 'react';
import PropTypes from 'prop-types';
import FocusLock from 'react-focus-lock';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import Preloader from 'common/components/Preloader';
import { enumerable } from 'common/utils/helpers';
import { MessageType } from 'common/constants/enums';
import { DIALOG_FADE_TIME } from 'common/constants/variables';
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
  isVisible,
  onCancel,
  onConfirm,
  pending,
  title
}) => (
  <CSSTransition
    classNames="dialog-fade"
    in={isVisible}
    timeout={DIALOG_FADE_TIME}
    unmountOnExit
  >
    <div className="dialog-wrapper">
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
    </div>
  </CSSTransition>
);

Dialog.defaultProps = {
  hasPermissions: true
};

Dialog.propTypes = {
  buttonStyleType: PropTypes.string,
  cancelLabel: PropTypes.string.isRequired,
  children: PropTypes.node,
  confirmLabel: PropTypes.string.isRequired,
  hasPermissions: PropTypes.bool,
  isVisible: PropTypes.bool,
  pending: PropTypes.bool,
  title: PropTypes.string,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func
};

export default Dialog;
