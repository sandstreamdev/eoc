import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';

const Dialog = ({ children, onCancel, onConfirm, title }) => (
  <Fragment>
    <Overlay type={OverlayStyleType.MEDIUM} />
    <div className="dialog">
      <h2 className="dialog__heading">{title && title}</h2>
      {children}
      <div className="dialog__footer">
        <button className="dialog__button" onClick={onCancel} type="button">
          Cancel
        </button>
        <button className="dialog__button" onClick={onConfirm} type="button">
          Confirm
        </button>
      </div>
    </div>
  </Fragment>
);

Dialog.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default Dialog;
