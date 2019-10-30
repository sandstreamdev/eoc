import { asyncTypes, enumerable } from 'common/utils/helpers';

export const LibrariesActionTypes = enumerable('libraries')(
  ...asyncTypes('FETCH_LIBRARIES'),
  ...asyncTypes('FETCH_LICENSE')
);
