import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SwitchButton = ({ checked, disabled, label, onChange, value }) => (
  <div className="ss-switch">
    <label className="ss-switch__label">
      {label}
      <input
        checked={checked}
        className="ss-switch__input"
        disabled={disabled}
        onChange={onChange}
        type="checkbox"
        value={value}
      />
      <span
        className={classNames('ss-switch__slider', {
          'ss-switch__slider--disabled': disabled
        })}
      />
    </label>
  </div>
);

SwitchButton.propTypes = {
  checked: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,

  onChange: PropTypes.func
};

export default SwitchButton;
