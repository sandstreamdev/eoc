import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import MessageBox from 'common/components/MessageBox';
import { MessageType as NotificationType } from 'common/constants/enums';
import { mapObject } from 'common/utils/helpers';

const Notification = ({ data, id, redirect, type }) => {
  const values =
    typeof data === 'string'
      ? { data: <em>{data}</em> }
      : { ...mapObject(value => <em>{value}</em>)(data) };

  return (
    <MessageBox type={type}>
      <FormattedMessage id={id} values={values} />
      {type === NotificationType.ERROR && !redirect && (
        <FormattedMessage id="common.try-again" />
      )}
    </MessageBox>
  );
};

Notification.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.objectOf(PropTypes.string)
  ]),
  id: PropTypes.string.isRequired,
  redirect: PropTypes.bool,
  type: PropTypes.string.isRequired
};

export default Notification;
