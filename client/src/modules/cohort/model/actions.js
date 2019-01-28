import { CohortActionTypes } from '../enum';

// Action creators
const fetchCohortsSuccess = () => ({
  type: CohortActionTypes.FETCH_ALL_COHORTS_SUCCESS
});

// Dispatchers
export const fetchAllCohorts = () => dispatch => {
  dispatch(fetchCohortsSuccess());
};
