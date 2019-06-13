import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import Preloader from 'common/components/Preloader';

export const DialogContext = Object.freeze({
  ARCHIVE: 'dialog/ARCHIVE',
  CREATE: 'dialog/create',
  UPDATE: 'dialog/UPDATE'
});

const Dialog = ({ children, onCancel, onConfirm, pending, title }) => (
  <Fragment>
    <Overlay type={OverlayStyleType.MEDIUM} />
    <div className="dialog">
      <header className="dialog__header">
        <h2 className="dialog__heading">{title && title}</h2>
      </header>
      <div className="dialog__body">
        {children && <div className="dialog__children">{children}</div>}
        <div className="dialog__footer">
          <button
            className="dialog__button primary-button"
            disabled={pending}
            onClick={onConfirm}
            type="button"
          >
            <FormattedMessage id="common.button.confirm" />
          </button>
          <button
            className="dialog__button primary-button"
            disabled={pending}
            onClick={onCancel}
            type="button"
          >
            <FormattedMessage id="common.button.cancel" />
          </button>
        </div>
        {pending && <Preloader />}
      </div>
    </div>
  </Fragment>
);

Dialog.propTypes = {
  children: PropTypes.node,
  pending: PropTypes.bool,
  title: PropTypes.string,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default Dialog;
