import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';

const DialogBox = ({ message, onCancel, onConfirm }) => (
  <Fragment>
    <Overlay type={OverlayStyleType.MEDIUM} />
    <div className="dialogbox">
      <header className="dialogbox__header">
        <h1 className="dialogbox__heading">{message}</h1>
      </header>
      <footer className="dialogbox__footer">
        <button className="dialogbox__button" onClick={onConfirm} type="button">
          Confirm
        </button>
        <button className="dialogbox__button" onClick={onCancel} type="button">
          Cancel
        </button>
      </footer>
    </div>
  </Fragment>
);

DialogBox.propTypes = {
  message: PropTypes.string,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default DialogBox;
