import _filter from 'lodash/filter';
import _head from 'lodash/head';
import _keyBy from 'lodash/keyBy';
import { createSelector } from 'reselect';
import _orderBy from 'lodash/orderBy';

export const getCohorts = state =>
  _keyBy(
    _orderBy(state.cohorts, cohort => new Date(cohort.createdAt).getTime(), [
      'desc'
    ]),
    '_id'
  );

export const getCohortDetails = (state, cohortId) => {
  const cohorts = getCohorts(state);
  const cohort = cohorts[cohortId];

  if (cohort) {
    const {
      description,
      externalAction,
      isArchived,
      isDeleted,
      isMember,
      isOwner,
      locks,
      members,
      name
    } = cohort;

    return {
      description,
      externalAction,
      isArchived,
      isDeleted,
      isMember,
      isOwner,
      locks,
      members,
      name
    };
  }
};

export const getActiveCohorts = createSelector(
  getCohorts,
  cohorts => _keyBy(_filter(cohorts, cohort => !cohort.isArchived), '_id')
);

export const getArchivedCohorts = createSelector(
  getCohorts,
  cohorts => _keyBy(_filter(cohorts, cohort => cohort.isArchived), '_id')
);

export const getMembers = createSelector(
  getCohortDetails,
  cohort => (cohort && cohort.members) || {}
);
