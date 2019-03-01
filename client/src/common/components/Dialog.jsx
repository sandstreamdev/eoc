import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import CreationForm from 'common/components/CreationForm';

// eslint-disable-next-line react/prefer-stateless-function
class Dialog extends Component {
  render() {
    const { children, onCancel, onConfirm, title } = this.props;
    return (
      <Fragment>
        <Overlay type={OverlayStyleType.MEDIUM} />
        <div className="dialog">
          <h2 className="dialog__heading">{title && title}</h2>
          {children}
          <div className="dialog__footer">
            <button className="dialog__button" onClick={onCancel} type="button">
              Cancel
            </button>
            <button
              className="dialog__button"
              onClick={onConfirm}
              type="button"
            >
              Confirm
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

Dialog.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,

  onCancel: PropTypes.func,
  onConfirm: PropTypes.func
};

export default Dialog;
