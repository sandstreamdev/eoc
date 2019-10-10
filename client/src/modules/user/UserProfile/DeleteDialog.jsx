import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import Dialog from 'common/components/Dialog';
import { IntlPropType } from 'common/constants/propTypes';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import DeleteForm from './DeleteForm';
import AlertBox from 'common/components/AlertBox';
import { MessageType } from 'common/constants/enums';
import ResourcePanel from './ResourcePanel';
import './DeleteDialog.scss';

const DeleteDialog = ({
  error,
  errorData,
  intl: { formatMessage },
  onCancel,
  onConfirm,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onVerificationTextChange,
  pending
}) => (
  <div className="delete-dialog">
    <Dialog
      buttonStyleType={MessageType.ERROR}
      confirmLabel="user.delete-account"
      hasPermissions
      onCancel={onCancel}
      onConfirm={onConfirm}
      pending={pending}
      title={formatMessage({ id: 'user.delete-account-question' })}
    >
      <AlertBox type={MessageType.ERROR}>
        <FormattedMessage id="user.delete-account-warning" />
      </AlertBox>
      {error && !errorData && (
        <ErrorMessage
          message={formatMessage({ id: 'user.delete-account-error' })}
        />
      )}
      {errorData && <ResourcePanel errorData={errorData} />}
      <DeleteForm
        error={error}
        errorData={errorData}
        onEmailChange={onEmailChange}
        onPasswordChange={onPasswordChange}
        onSubmit={onSubmit}
        onVerificationTextChange={onVerificationTextChange}
      />
    </Dialog>
  </div>
);

DeleteDialog.propTypes = {
  error: PropTypes.bool,
  errorData: PropTypes.shape({
    cohorts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    ),
    lists: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      })
    )
  }),
  intl: IntlPropType.isRequired,
  pending: PropTypes.bool,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onEmailChange: PropTypes.func.isRequired,
  onPasswordChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onVerificationTextChange: PropTypes.func.isRequired
};

export default injectIntl(DeleteDialog);
