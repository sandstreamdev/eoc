import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';

const DialogBox = ({ message, onCancel, onConfirm }) => (
  <Fragment>
    <Overlay type={OverlayStyleType.MEDIUM} />
    <div className="dialogbox">
      <h1 className="dialogbox__heading">{message}</h1>
      <button className="dialogbox__button" onClick={onCancel} type="button">
        Cancel
      </button>
      <button className="dialogbox__button" onClick={onConfirm} type="button">
        Confirm
      </button>
    </div>
  </Fragment>
);

DialogBox.propTypes = {
  message: PropTypes.string,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default DialogBox;
