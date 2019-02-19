import React from 'react';
import PropTypes from 'prop-types';

import { SvgIcon } from 'assets/images/icons';

const ToolbarItem = ({ children, mainIcon, onClick, additionalIconSrc }) => (
  <div className="toolbar-item z-index-high">
    <button className="toolbar-item__icon-link" onClick={onClick} type="button">
      <SvgIcon icon={mainIcon} />
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
  mainIcon: PropTypes.string.isRequired,
  additionalIconSrc: PropTypes.string,

  onClick: PropTypes.func.isRequired
};

export default ToolbarItem;
