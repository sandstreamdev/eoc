import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay, { OverlayStyleType } from 'common/components/Overlay';
import CreationForm, { CreationFormType } from 'common/components/CreationForm';

const ModalForm = ({
  defaultDescription,
  defaultName,
  label,
  onCancel,
  onSubmit
}) => (
  <Fragment>
    <Overlay type={OverlayStyleType.MEDIUM} />
    <div className="modal-form">
      <CreationForm
        defaultDescription={defaultDescription}
        defaultName={defaultName}
        label={label}
        onCancel={onCancel}
        onSubmit={onSubmit}
        type={CreationFormType.MODAL}
      />
    </div>
  </Fragment>
);

ModalForm.propTypes = {
  defaultDescription: PropTypes.string,
  defaultName: PropTypes.string,
  label: PropTypes.string,

  onCancel: PropTypes.func,
  onSubmit: PropTypes.func
};

export default ModalForm;
