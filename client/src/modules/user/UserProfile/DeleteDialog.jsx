import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';

import Dialog from 'common/components/Dialog';
import { IntlPropType } from 'common/constants/propTypes';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import AlertBox from 'common/components/AlertBox';
import { MessageType } from 'common/constants/enums';
import './DeleteDialog.scss';

const DeleteDialog = ({
  error: authorizationError,
  intl: { formatMessage },
  isVisible,
  onCancel,
  onConfirm,
  pending
}) => {
  return (
    <div className="delete-dialog">
      <Dialog
        buttonStyleType={MessageType.ERROR}
        cancelLabel={formatMessage({ id: 'common.button.cancel' })}
        confirmLabel={formatMessage({ id: 'user.delete-account' })}
        hasPermissions
        isVisible={isVisible}
        onCancel={onCancel}
        onConfirm={onConfirm}
        pending={pending}
        title={formatMessage({ id: 'user.delete-account-question' })}
      >
        <AlertBox type={MessageType.ERROR}>
          <FormattedMessage id="user.delete-account-warning" />
        </AlertBox>
        {authorizationError && (
          <ErrorMessage
            message={formatMessage({ id: 'user.delete-account-error' })}
          />
        )}
      </Dialog>
    </div>
  );
};

DeleteDialog.propTypes = {
  error: PropTypes.bool,
  intl: IntlPropType.isRequired,
  isVisible: PropTypes.bool.isRequired,
  pending: PropTypes.bool,

  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default injectIntl(DeleteDialog);
