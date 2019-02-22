import _filter from 'lodash/filter';
import _isEmpty from 'lodash/isEmpty';

export const getCohorts = state => state.cohorts.data;
export const getCohortsError = state => state.cohorts.errorMessage;
export const getIsFetchingCohorts = state => state.cohorts.isFetching;
export const getCohortDetails = (state, cohortId) => {
  if (!_isEmpty(state.cohorts.data)) {
    const { description, name } = _filter(
      state.cohorts.data,
      (value, key) => key === cohortId
    )[0];

    return {
      description,
      name
    };
  }
};
