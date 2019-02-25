import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ToolbarButton = ({ additionalIconSrc, children, mainIcon, onClick }) => (
  <Fragment>
    <button className="toolbar-button" onClick={onClick} type="button">
      {mainIcon}
      {additionalIconSrc && (
        <img
          alt="Plus icon"
          className="toolbar-button__icon-plus"
          src={additionalIconSrc}
        />
      )}
    </button>
    {children && <div className="z-index-high">{children}</div>}
  </Fragment>
);

ToolbarButton.propTypes = {
  additionalIconSrc: PropTypes.string,
  children: PropTypes.node,
  mainIcon: PropTypes.node.isRequired,

  onClick: PropTypes.func.isRequired
};

export default ToolbarButton;
