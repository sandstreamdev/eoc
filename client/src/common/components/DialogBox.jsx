import React from 'react';
import PropTypes from 'prop-types';

const DialogBox = ({ message, confirm }) => (
  <div className="overlay">
    <div className="dialogbox">
      <h1 className="dialogbox__heading">{message}</h1>
      <button className="dialogbox__button" type="button">
        Cancel
      </button>
      <button className="dialogbox__button" onClick={confirm} type="button">
        Confirm
      </button>
    </div>
  </div>
);

export default DialogBox;

DialogBox.propTypes = {
  message: PropTypes.string,

  confirm: PropTypes.func
};
