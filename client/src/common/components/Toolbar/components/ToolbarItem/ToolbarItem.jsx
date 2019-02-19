import React from 'react';
import PropTypes from 'prop-types';

const ToolbarItem = ({ children, mainIcon, onClick, additionalIconSrc }) => (
  <div className="toolbar-item z-index-high">
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
    {children}
  </div>
);

ToolbarItem.propTypes = {
  children: PropTypes.node,
  mainIcon: PropTypes.node.isRequired,
  additionalIconSrc: PropTypes.string,

  onClick: PropTypes.func.isRequired
};

export default ToolbarItem;
