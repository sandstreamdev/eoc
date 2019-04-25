import React from 'react';
import PropTypes from 'prop-types';

const Switcher = ({ checked, htmlFor, label, onChange, value }) => (
  <div className="ss-switch">
    <label className="ss-switch__label" htmlFor={htmlFor}>
      {label}
      <input
        checked={checked}
        className="ss-switch__input"
        id={htmlFor}
        onChange={onChange}
        type="checkbox"
        value={value}
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
