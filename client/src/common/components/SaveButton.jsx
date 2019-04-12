import React from 'react';
import PropTypes from 'prop-types';

import { DiscIcon } from 'assets/images/icons';

const SaveButton = ({ disabled, onClick, value }) => (
  <button
    className="save-button"
    disabled={disabled}
    onClick={onClick}
    type="button"
  >
    {value}
    <div className="save-button__icon">
      <DiscIcon />
    </div>
  </button>
);

SaveButton.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string.isRequired,

  onClick: PropTypes.func
};

export default SaveButton;
