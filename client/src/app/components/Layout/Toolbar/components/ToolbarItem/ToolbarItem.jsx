import React from 'react';
import PropTypes from 'prop-types';

const ToolbarItem = ({
  additionalIconSrc,
  children,
  disabled,
  mainIcon,
  onClick,
  title
}) => (
  <div className="toolbar-item">
    <button
      className="toolbar-item__icon-link"
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
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
  disabled: PropTypes.bool,
  mainIcon: PropTypes.node.isRequired,
  title: PropTypes.string,

  onClick: PropTypes.func.isRequired
};

export default ToolbarItem;
