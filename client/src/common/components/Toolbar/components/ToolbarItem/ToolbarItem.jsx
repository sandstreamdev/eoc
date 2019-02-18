import React from 'react';
import PropTypes from 'prop-types';

import { SvgIcon } from 'assets/images/icons';

const ToolbarItem = ({ children, mainIcon, onClick, supplementIconSrc }) => (
  <div className="toolbar__icon-wrapper z-index-high">
    <button className="toolbar__icon-link" onClick={onClick} type="button">
      <SvgIcon icon={mainIcon} />
      {supplementIconSrc && (
        <img
          alt="Plus icon"
          className="toolbar__icon-plus"
          src={supplementIconSrc}
        />
      )}
    </button>
    {children && children}
  </div>
);

ToolbarItem.propTypes = {
  children: PropTypes.node,
  mainIcon: PropTypes.string.isRequired,
  supplementIconSrc: PropTypes.string,

  onClick: PropTypes.func.isRequired
};

export default ToolbarItem;
