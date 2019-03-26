import _filter from 'lodash/filter';
import _head from 'lodash/head';

export const getCohorts = state => state.cohorts.data;
export const getCohortsError = state => state.cohorts.errorMessage;
export const getIsFetchingCohorts = state => state.cohorts.isFetching;
export const getCohortDetails = (state, cohortId) => {
  const cohort = _head(
    _filter(getCohorts(state), (_, key) => key === cohortId)
  );
  if (cohort) {
    const { description, isOwner, isArchived, name } = cohort;
    return { description, isOwner, isArchived, name };
  }
};
