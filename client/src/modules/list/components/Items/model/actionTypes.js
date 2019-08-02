import { asyncTypes, enumerable } from 'common/utils/helpers';

export const CommentActionTypes = enumerable('comment')(
  ...asyncTypes('ADD'),
  ...asyncTypes('FETCH')
);

export const ItemActionTypes = enumerable('item')(
  ...asyncTypes('ADD'),
  ...asyncTypes('ARCHIVE'),
  ...asyncTypes('CLEAR_VOTE'),
  ...asyncTypes('CLONE'),
  ...asyncTypes('DELETE'),
  ...asyncTypes('FETCH_ARCHIVED'),
  'REMOVE_ARCHIVED',
  ...asyncTypes('RESTORE'),
  ...asyncTypes('SET_VOTE'),
  ...asyncTypes('TOGGLE'),
  ...asyncTypes('UPDATE')
);

export const ItemStatusType = enumerable('item')('LOCK', 'UNLOCK');
