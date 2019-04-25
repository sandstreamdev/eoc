import React from 'react';
import PropTypes from 'prop-types';

const Switcher = ({ checked, label, htmlFor, onChange, value }) => (
  <div className="ss-switch">
    <label className="ss-switch__label" htmlFor={htmlFor}>
      {label}
      <input
        className="ss-switch__input"
        id={htmlFor}
        type="checkbox"
        checked={checked}
        value={value}
        onChange={onChange}
      />
      <span className="ss-switch__slider" />
    </label>
  </div>
);

Switcher.propTypes = {
  checked: PropTypes.bool.isRequired,
  htmlFor: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired
};

export default Switcher;
