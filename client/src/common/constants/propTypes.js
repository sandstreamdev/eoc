import PropTypes from 'prop-types';

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

const oneOfValues = xs => PropTypes.oneOf(Object.values(xs));

export const MessagePropType = oneOfValues(MessageType);
export const SortOrderPropType = oneOfValues(SortOrderType);
export const StatusPropType = oneOfValues(StatusType);
export const IntlPropType = PropTypes.objectOf(
  PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object])
);

export const IconPropType = {
  label: PropTypes.string,
  title: PropTypes.string
};
