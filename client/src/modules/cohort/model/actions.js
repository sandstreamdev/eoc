import _keyBy from 'lodash/keyBy';

import { ENDPOINT_URL } from 'common/constants/variables';
import { CohortActionTypes } from './actionTypes';
import { getData, postData } from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { fetchShoppingListMetaDataForGivenCohort } from 'modules/shopping-list/model/actions';

// Action creators
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

const fetchCohortsMetaDataSuccess = data => ({
  type: CohortActionTypes.FETCH_META_DATA_SUCCESS,
  payload: data
});

const fetchCohortsMetaDataFailure = errMessage => ({
  type: CohortActionTypes.FETCH_META_DATA_FAILURE,
  errMessage
});

const fetchCohortsMetaDataRequest = () => ({
  type: CohortActionTypes.FETCH_META_DATA_REQUEST
});

const fetchCohortDetailsRequest = () => ({
  type: CohortActionTypes.FETCH_DETAILS_REQUEST
});

const fetchCohortDetailsSuccess = (cohortId, data) => ({
  type: CohortActionTypes.FETCH_DETAILS_SUCCESS,
  payload: { cohortId, data }
});

const fetchCohortDetailsFailure = errMessage => ({
  type: CohortActionTypes.FETCH_DETAILS_FAILURE,
  errMessage
});

// Dispatchers
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

export const fetchCohortsMetaData = () => dispatch => {
  dispatch(fetchCohortsMetaDataRequest());
  getData(`${ENDPOINT_URL}/cohorts/meta-data`)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchCohortsMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchCohortsMetaDataFailure(err.message));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching cohorts failed..."
      );
    });
};

export const fetchCohortDetails = cohortId => dispatch => {
  dispatch(fetchCohortDetailsRequest());
  getData(`${ENDPOINT_URL}/cohorts/${cohortId}/details`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchCohortDetailsSuccess(cohortId, json)))
    .then(() => fetchShoppingListMetaDataForGivenCohort(cohortId)(dispatch))
    .catch(err => {
      dispatch(fetchCohortDetailsFailure(err.message));
    });
};
