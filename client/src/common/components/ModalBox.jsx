import React from 'react';
import PropTypes from 'prop-types';

const ModalBox = ({ children }) => (
  <div className="overlay">
    <div className="modalbox">{children}</div>
  </div>
);

ModalBox.propTypes = {
  children: PropTypes.node
};

export default ModalBox;
