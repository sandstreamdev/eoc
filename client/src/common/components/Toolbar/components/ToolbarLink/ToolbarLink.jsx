import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ToolbarLink = ({ additionalIconSrc, mainIcon, path }) => (
  <div className="toolbar-link">
    <Link className="toolbar-link__icon-link" to={path}>
      {mainIcon}
      {additionalIconSrc && (
        <img
          alt="Plus icon"
          className="toolbar-link__icon-plus"
          src={additionalIconSrc}
        />
      )}
    </Link>
  </div>
);

ToolbarLink.propTypes = {
  additionalIconSrc: PropTypes.string,
  mainIcon: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired
};

export default ToolbarLink;
