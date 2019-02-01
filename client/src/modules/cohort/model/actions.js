import { ENDPOINT_URL } from 'common/constants/variables';
import { CohortActionTypes } from './actionTypes';
import { getData, postData } from 'common/utils/fetchMethods';

// Action creators
const createCohortSuccess = data => ({
  type: CohortActionTypes.CREATE_COHORT_SUCCESS,
  payload: data
});

const fetchCohortsSuccess = data => ({
  type: CohortActionTypes.FETCH_COHORTS_SUCCESS,
  payload: data
});

// Dispatchers
export const createCohort = (name, description) => dispatch =>
  postData(`${ENDPOINT_URL}/cohorts/new`, { name, description })
    .then(resp => resp.json())
    .then(json => dispatch(createCohortSuccess(json)))
    .catch(err => console.error(err));

export const fetchCohorts = () => dispatch => {
  getData(`${ENDPOINT_URL}/cohorts`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchCohortsSuccess(json)))
    .catch(err => console.err(err));
};
