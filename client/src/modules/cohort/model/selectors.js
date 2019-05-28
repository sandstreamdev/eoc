import _filter from 'lodash/filter';
import _head from 'lodash/head';
import _keyBy from 'lodash/keyBy';
import { createSelector } from 'reselect';

export const getCohorts = state => state.cohorts;

export const getCohortDetails = (state, cohortId) => {
  const cohort = _head(
    _filter(getCohorts(state), (_, key) => key === cohortId)
  );

  if (cohort) {
    const {
      description,
      isArchived,
      isMember,
      isOwner,
      members,
      name
    } = cohort;
    return { description, isMember, isOwner, isArchived, members, name };
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
  cohort => cohort && _keyBy(cohort.members, '_id')
);
