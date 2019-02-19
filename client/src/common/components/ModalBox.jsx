import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import CloseIcon from 'assets/images/times-solid.svg';

const ModalBox = ({ children, onClose }) => (
  <Fragment>
    <Overlay type={OverlayStyleType.MEDIUM} />
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
  </Fragment>
);

ModalBox.propTypes = {
  children: PropTypes.node.isRequired,

  onClose: PropTypes.func
};

export default ModalBox;
