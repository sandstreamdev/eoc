import React from 'react';
import PropTypes from 'prop-types';

import CreationForm from 'common/components/CreationForm';

const DropdownForm = ({ isVisible, label, onHide, onSubmit, type }) =>
  isVisible && (
    <CreationForm
      label={label}
      onHide={onHide}
      onSubmit={onSubmit}
      type={type}
    />
  );

DropdownForm.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,

  onHide: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default DropdownForm;
