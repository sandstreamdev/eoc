import { asyncTypes, enumerable } from 'common/utils/helpers';

export const ActivitiesActionTypes = enumerable('activities')(
  ...asyncTypes('FETCH'),
  'REMOVE'
);
