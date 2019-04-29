import React from 'react';
import PropTypes from 'prop-types';

const SwitchButton = ({ checked, label, onChange, value }) => (
  <div className="ss-switch">
    <label className="ss-switch__label">
      {label}
      <input
        checked={checked}
        className="ss-switch__input"
        onChange={onChange}
        type="checkbox"
        value={value}
      />
      <span className="ss-switch__slider" />
    </label>
  </div>
);

SwitchButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired
};

export default SwitchButton;
