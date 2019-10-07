import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import Dialog from 'common/components/Dialog';
import { IntlPropType } from 'common/constants/propTypes';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import DeleteForm from './DeleteForm';
import './DeleteDialog.scss';
import { InfoIcon } from 'assets/images/icons';

const DeleteDialog = ({
  error,
  intl: { formatMessage },
  onCancel,
  onConfirm,
  onEmailChange,
  onPasswordChange,
  onVerificationTextChange,
  pending
}) => (
  <Dialog
    confirmLabel="user.delete-account"
    hasPermissions
    onCancel={onCancel}
    onConfirm={onConfirm}
    pending={pending}
    title={formatMessage({ id: 'user.delete-account-question' })}
  >
    <div className="delete-dialog__warning">
      <InfoIcon />
      <FormattedMessage id="user.delete-account-warning" />
    </div>
    {error && (
      <ErrorMessage
        message={formatMessage({ id: 'user.delete-account-error' })}
      />
    )}
    <DeleteForm
      error={error}
      onEmailChange={onEmailChange}
      onPasswordChange={onPasswordChange}
      onVerificationTextChange={onVerificationTextChange}
    />
  </Dialog>
);

DeleteDialog.propTypes = {
  error: PropTypes.bool,
  intl: IntlPropType.isRequired,
  pending: PropTypes.bool,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onVerificationTextChange: PropTypes.func.isRequired
};

export default injectIntl(DeleteDialog);
