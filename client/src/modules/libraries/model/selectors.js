import _map from 'lodash/map';

export const getLibrariesNames = state =>
  _map(state.libraries, library => library.name).sort();

export const getLicense = (state, name) => state.libraries[name].license;
