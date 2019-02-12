import React from 'react';
import PropTypes from 'prop-types';

const DialogBox = ({ cancelCallback, cofirmCallback, message }) => (
  <div className="overlay">
    <div className="dialogbox">
      <h1 className="dialogbox__heading">{message}</h1>
      <button
        className="dialogbox__button"
        onClick={cancelCallback}
        type="button"
      >
        Cancel
      </button>
      <button
        className="dialogbox__button"
        onClick={cofirmCallback}
        type="button"
      >
        Confirm
      </button>
    </div>
  </div>
);

export default DialogBox;

DialogBox.propTypes = {
  message: PropTypes.string,

  cancelCallback: PropTypes.func.isRequired,
  cofirmCallback: PropTypes.func.isRequired
};
