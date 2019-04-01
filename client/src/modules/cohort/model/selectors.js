import _filter from 'lodash/filter';
import _head from 'lodash/head';
import _sortBy from 'lodash/sortBy';
import _keyBy from 'lodash/keyBy';
import { createSelector } from 'reselect';

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

export const getActiveCohorts = createSelector(
  getCohorts,
  cohorts =>
    _keyBy(
      _sortBy(
        _filter(cohorts, cohort => !cohort.isArchived),
        el => !el.isFavourite
      ),
      '_id'
    )
);

export const getArchivedCohorts = createSelector(
  getCohorts,
  cohorts =>
    _keyBy(
      _sortBy(
        _filter(cohorts, cohort => cohort.isArchived),
        el => !el.isFavourite
      ),
      '_id'
    )
);

export const getMembers = (state, id) =>
  _keyBy(state.cohorts.data[id].members, '_id');
