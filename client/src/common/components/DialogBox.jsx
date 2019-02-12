import React from 'react';
import PropTypes from 'prop-types';

const DialogBox = ({ onCancel, onConfirm, message }) => (
  <div className="dialogbox">
    <h1 className="dialogbox__heading">{message}</h1>
    <button className="dialogbox__button" onClick={onCancel} type="button">
      Cancel
    </button>
    <button className="dialogbox__button" onClick={onConfirm} type="button">
      Confirm
    </button>
  </div>
);

DialogBox.propTypes = {
  message: PropTypes.string,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default DialogBox;
