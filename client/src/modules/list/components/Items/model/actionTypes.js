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
  ...asyncTypes('MARK_AS_DONE'),
  ...asyncTypes('MARK_AS_UNHANDLED'),
  ...asyncTypes('FETCH_ARCHIVED'),
  ...asyncTypes('MOVE'),
  'REMOVE_ARCHIVED',
  ...asyncTypes('RESTORE'),
  ...asyncTypes('SET_VOTE'),
  ...asyncTypes('TOGGLE'),
  ...asyncTypes('UPDATE')
);

export const AnimationActionTypes = enumerable('animations')(
  'DISABLE_FOR_ARCHIVED_ITEMS',
  'DISABLE_FOR_DONE_ITEMS',
  'DISABLE_FOR_UNHANDLED_ITEMS'
);

export const ItemStatusType = enumerable('item')('LOCK', 'UNLOCK');
