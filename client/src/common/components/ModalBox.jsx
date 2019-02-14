import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from 'assets/images/times-solid.svg';

const ModalBox = ({ children, onClose }) => (
  <div className="overlay">
    <div className="modalbox">
      {onClose && (
        <button
          className="modalbox__cancel-button"
          onClick={onClose}
          type="button"
        >
          <img alt="Close Icon" className="modalbox__icon" src={CloseIcon} />
        </button>
      )}
      {children}
    </div>
  </div>
);

ModalBox.propTypes = {
  children: PropTypes.node.isRequired,

  onClose: PropTypes.func
};

export default ModalBox;
