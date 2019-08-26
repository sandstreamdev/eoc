import { asyncTypes, enumerable } from 'common/utils/helpers';

export const ListActionTypes = enumerable('list')(
  ...asyncTypes('ADD_MEMBER_ROLE'),
  ...asyncTypes('ADD_OWNER_ROLE'),
  ...asyncTypes('ADD_VIEWER'),
  ...asyncTypes('ARCHIVE'),
  ...asyncTypes('CHANGE_TYPE'),
  ...asyncTypes('CREATE'),
  ...asyncTypes('DELETE'),
  ...asyncTypes('FAVOURITES'),
  ...asyncTypes('FETCH_ARCHIVED_META_DATA'),
  ...asyncTypes('FETCH_DATA'),
  ...asyncTypes('FETCH_META_DATA'),
  ...asyncTypes('LEAVE'),
  'LEAVE_VIEW',
  ...asyncTypes('MEMBER_UPDATE'),
  'REMOVE_ARCHIVED_META_DATA',
  'REMOVE_BY_IDS',
  ...asyncTypes('REMOVE_MEMBER_ROLE'),
  ...asyncTypes('REMOVE_MEMBER'),
  ...asyncTypes('REMOVE_OWNER_ROLE'),
  ...asyncTypes('RESTORE'),
  ...asyncTypes('UPDATE')
);

export const ListHeaderStatusType = enumerable('list-header')('LOCK', 'UNLOCK');
