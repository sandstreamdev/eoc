import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const ToolbarItem = ({
  additionalIconSrc,
  children,
  mainIcon,
  onClick,
  path
}) => (
  <div className="toolbar-item">
    {onClick ? (
      <Fragment>
        <button
          className="toolbar-item__icon-link"
          onClick={onClick}
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
      </Fragment>
    ) : (
      <Link className="toolbar-item__icon-link" to={path}>
        {mainIcon}
        {additionalIconSrc && (
          <img
            alt="Plus icon"
            className="toolbar-item__icon-plus"
            src={additionalIconSrc}
          />
        )}
      </Link>
    )}
  </div>
);

ToolbarItem.propTypes = {
  additionalIconSrc: PropTypes.string,
  children: PropTypes.node,
  mainIcon: PropTypes.node.isRequired,
  path: PropTypes.string,

  onClick: PropTypes.func
};

export default ToolbarItem;
