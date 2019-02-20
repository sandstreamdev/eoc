import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';

class ModalBox extends Component {
  componentDidMount() {
    document.addEventListener('keydown', this.escapeLister);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.escapeLister);
  }

  escapeLister = event => {
    const { code } = event;
    const { onCancel } = this.props;

    if (code === 'Escape') {
      onCancel && onCancel();
    }
  };

  render() {
    const { children, onCancel } = this.props;
    return (
      <Fragment>
        <Overlay type={OverlayStyleType.MEDIUM} />
        <div className="modalbox">
          {onCancel && (
            <button
              className="modalbox__cancel-button"
              onClick={onCancel}
              type="button"
            >
              Cancel
            </button>
          )}
          {children}
        </div>
      </Fragment>
    );
  }
}

ModalBox.propTypes = {
  children: PropTypes.node.isRequired,

  onCancel: PropTypes.func
};

export default ModalBox;
