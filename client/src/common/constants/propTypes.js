import PropTypes from 'prop-types';
import _values from 'lodash/values';

import { SortOrderType, StatusType, MessageType } from './enums';

export const UserPropType = PropTypes.shape({
  avatarUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
});

export const MessagePropType = PropTypes.oneOf(_values(MessageType));
export const SortOrderPropType = PropTypes.oneOf(_values(SortOrderType));
export const StatusPropType = PropTypes.oneOf(_values(StatusType));
