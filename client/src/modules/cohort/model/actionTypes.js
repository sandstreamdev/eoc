import { asyncTypes, enumerable } from 'common/utils/helpers';

export const CohortActionTypes = enumerable('cohort')(
  ...asyncTypes('ADD_MEMBER'),
  ...asyncTypes('ADD_OWNER_ROLE'),
  ...asyncTypes('ARCHIVE'),
  ...asyncTypes('CREATE'),
  ...asyncTypes('DELETE'),
  ...asyncTypes('FETCH_ARCHIVED_META_DATA'),
  ...asyncTypes('FETCH_DETAILS'),
  ...asyncTypes('FETCH_META_DATA'),
  ...asyncTypes('LEAVE'),
  'LEAVE_VIEW',
  ...asyncTypes('MEMBER_UPDATE'),
  'REMOVE_ARCHIVED_META_DATA',
  ...asyncTypes('REMOVE_MEMBER'),
  ...asyncTypes('REMOVE_OWNER_ROLE'),
  ...asyncTypes('RESTORE'),
  ...asyncTypes('UPDATE')
);

export const CohortHeaderStatusTypes = enumerable('cohort-header')(
  'LOCK',
  'UNLOCK'
);
