import PropTypes from 'prop-types';
import _values from 'lodash/values';

import { MessageType, SortOrderType, StatusType } from './enums';

export const RouterMatchPropType = PropTypes.shape({
  params: PropTypes.shape({
    hash: PropTypes.string,
    id: PropTypes.string
  })
});
export const UserPropType = PropTypes.shape({
  activationDate: PropTypes.string,
  avatarUrl: PropTypes.string,
  email: PropTypes.string,
  id: PropTypes.string.isRequired,
  isPasswordSet: PropTypes.bool,
  name: PropTypes.string.isRequired
});

export const MessagePropType = PropTypes.oneOf(_values(MessageType));
export const SortOrderPropType = PropTypes.oneOf(_values(SortOrderType));
export const StatusPropType = PropTypes.oneOf(_values(StatusType));
export const IntlPropType = PropTypes.objectOf(
  PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object])
);

export const IconPropType = {
  label: PropTypes.string,
  title: PropTypes.string
};

export const ErrorDataPropType = PropTypes.shape({
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
});
