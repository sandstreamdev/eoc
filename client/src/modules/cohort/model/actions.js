import { ENDPOINT_URL } from 'common/constants/variables';
import { CohortActionTypes } from './actionTypes';
import { getData, postData } from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

const createCohortSuccess = data => ({
  type: CohortActionTypes.CREATE_COHORT_SUCCESS,
  payload: data
});

const createCohortFailure = errMessage => ({
  type: CohortActionTypes.CREATE_COHORT_FAILURE,
  errMessage
});

const createCohortRequest = () => ({
  type: CohortActionTypes.CREATE_COHORT_REQUEST
});

const fetchCohortsSuccess = data => ({
  type: CohortActionTypes.FETCH_COHORTS_SUCCESS,
  payload: data
});

const fetchCohortsFailure = errMessage => ({
  type: CohortActionTypes.FETCH_COHORTS_FAILURE,
  errMessage
});

const fetchCohortsRequest = () => ({
  type: CohortActionTypes.FETCH_COHORTS_REQUEST
});

export const createCohort = (name, description, adminId) => dispatch => {
  dispatch(createCohortRequest());
  postData(`${ENDPOINT_URL}/cohorts/create`, {
    name,
    description,
    adminId
  })
    .then(resp => resp.json())
    .then(json => dispatch(createCohortSuccess(json)))
    .catch(err => {
      dispatch(createCohortFailure(err.message));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, creating new cohort failed..."
      );
    });
};

export const fetchCohorts = () => dispatch => {
  dispatch(fetchCohortsRequest());
  getData(`${ENDPOINT_URL}/cohorts`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchCohortsSuccess(json)))
    .catch(err => {
      dispatch(fetchCohortsFailure(err.message));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching cohorts failed..."
      );
    });
};
