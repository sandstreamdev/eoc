import React from 'react';
import PropTypes from 'prop-types';

const ModalBox = ({ children, onClose }) => (
  <div className="modalbox">
    {onClose && (
      <button
        className="modalbox__cancel-button"
        onClick={onClose}
        type="button"
      >
        Cancel
      </button>
    )}
    {children}
  </div>
);

ModalBox.propTypes = {
  children: PropTypes.node.isRequired,

  onClose: PropTypes.func
};

export default ModalBox;
