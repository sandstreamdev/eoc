import React from 'react';
import PropTypes from 'prop-types';

const DialogBox = ({ message, cofirmCallback, cancelCallback }) => (
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
);

DialogBox.propTypes = {
  message: PropTypes.string,

  cancelCallback: PropTypes.func,
  cofirmCallback: PropTypes.func
};

export default DialogBox;
