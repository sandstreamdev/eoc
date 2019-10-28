import _map from 'lodash/map';

export const getLibraries = state =>
  _map(state.libraries, library => library.name).sort();

export const getLicense = (state, name) => state.libraries[name].license;
