import React from 'react';
import PropTypes from 'prop-types';

const ToolbarItem = ({ additionalIconSrc, children, mainIcon, onClick }) => (
  <div className="toolbar-item">
    <button className="toolbar-item__icon-link" onClick={onClick} type="button">
      {mainIcon}
      {additionalIconSrc && (
        <img
          alt="Plus icon"
          className="toolbar-item__icon-plus"
          src={additionalIconSrc}
        />
      )}
    </button>
    {children && <div className="z-index-high">{children}</div>}
  </div>
);

ToolbarItem.propTypes = {
  additionalIconSrc: PropTypes.string,
  children: PropTypes.node,
  mainIcon: PropTypes.node.isRequired,

  onClick: PropTypes.func.isRequired
};

export default ToolbarItem;
