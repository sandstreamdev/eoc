import PropTypes from 'prop-types';
import _values from 'lodash/values';

import { StatusType, MessageType } from './enums';

export const UserPropType = PropTypes.shape({
  avatar: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});
export const MessagePropType = PropTypes.oneOf(_values(MessageType));
export const StatusPropType = PropTypes.oneOf(_values(StatusType));
