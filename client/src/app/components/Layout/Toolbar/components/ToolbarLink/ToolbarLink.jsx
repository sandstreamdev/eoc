import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './ToolbarLink.scss';

const ToolbarLink = ({ additionalIconSrc, mainIcon, path, title }) => (
  <div className="toolbar-link">
    <Link className="toolbar-link__icon-link" title={title} to={path}>
      {mainIcon}
      {additionalIconSrc && (
        <img
          alt="Icon"
          className="toolbar-link__additional-icon"
          src={additionalIconSrc}
        />
      )}
    </Link>
  </div>
);

ToolbarLink.propTypes = {
  additionalIconSrc: PropTypes.string,
  mainIcon: PropTypes.node.isRequired,
  path: PropTypes.string.isRequired,
  title: PropTypes.string
};

export default ToolbarLink;
