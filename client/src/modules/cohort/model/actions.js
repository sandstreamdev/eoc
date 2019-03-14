import _keyBy from 'lodash/keyBy';

import { ENDPOINT_URL } from 'common/constants/variables';
import { CohortActionTypes } from './actionTypes';
import {
  deleteData,
  getData,
  patchData,
  postData
} from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import history from 'common/utils/history';

const createCohortSuccess = data => ({
  type: CohortActionTypes.CREATE_SUCCESS,
  payload: data
});

const createCohortFailure = errMessage => ({
  type: CohortActionTypes.CREATE_FAILURE,
  errMessage
});

const createCohortRequest = () => ({
  type: CohortActionTypes.CREATE_REQUEST
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

const updateCohortRequest = () => ({
  type: CohortActionTypes.UPDATE_REQUEST
});

const updateCohortSuccess = data => ({
  type: CohortActionTypes.UPDATE_SUCCESS,
  payload: data
});

const updateCohortFailure = err => ({
  type: CohortActionTypes.UPDATE_FAILURE,
  payload: err.message
});

const archiveCohortSuccess = id => ({
  type: CohortActionTypes.ARCHIVE_SUCCESS,
  payload: id
});

const archiveCohortFailure = errMessage => ({
  type: CohortActionTypes.ARCHIVE_FAILURE,
  payload: errMessage
});

const archiveCohortRequest = () => ({
  type: CohortActionTypes.ARCHIVE_REQUEST
});

const restoreCohortSuccess = (data, _id) => ({
  type: CohortActionTypes.RESTORE_SUCCESS,
  payload: { data, _id }
});

const restoreCohortFailure = errMessage => ({
  type: CohortActionTypes.RESTORE_FAILURE,
  payload: errMessage
});

const restoreCohortRequest = () => ({
  type: CohortActionTypes.RESTORE_REQUEST
});

const deleteCohortSuccess = _id => ({
  type: CohortActionTypes.DELETE_SUCCESS,
  payload: _id
});

const deleteCohortFailure = errMessage => ({
  type: CohortActionTypes.DELETE_FAILURE,
  payload: errMessage
});

const deleteCohortRequest = () => ({
  type: CohortActionTypes.DELETE_REQUEST
});

const fetchCohortDetailsFailure = errMessage => ({
  type: CohortActionTypes.FETCH_DETAILS_FAILURE,
  payload: errMessage
});

const fetchCohortDetailsSuccess = (data, _id) => ({
  type: CohortActionTypes.FETCH_DETAILS_SUCCESS,
  payload: { data, _id }
});

const fetchCohortDetailsRequest = () => ({
  type: CohortActionTypes.FETCH_DETAILS_REQUEST
});

const fetchArchivedCohortsMetaDataSuccess = data => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload: data
});
const fetchArchivedCohortsMetaDataFailure = errMessage => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE,
  payload: errMessage
});
const fetchArchivedCohortsMetaDataRequest = () => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_REQUEST
});

export const createCohort = (name, description, adminId) => dispatch => {
  dispatch(createCohortRequest());
  return postData(`${ENDPOINT_URL}/cohorts/create`, {
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
  return getData(`${ENDPOINT_URL}/cohorts/meta-data`)
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
        err.message || "Oops, we're sorry, fetching cohorts meta data failed..."
      );
    });
};

export const fetchArchivedCohortsMetaData = () => dispatch => {
  dispatch(fetchArchivedCohortsMetaDataRequest());
  return getData(`${ENDPOINT_URL}/cohorts/archived`)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedCohortsMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchArchivedCohortsMetaDataFailure(err.message));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching cohorts failed..."
      );
    });
};

export const updateCohort = (cohortId, data) => dispatch => {
  dispatch(updateCohortRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/update`, data)
    .then(resp => resp.json())
    .then(json => {
      dispatch(updateCohortSuccess({ ...data, cohortId }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(updateCohortFailure(err));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, updating cohort failed..."
      );
    });
};

export const deleteCohort = cohortId => dispatch => {
  dispatch(deleteCohortRequest());
  return deleteData(`${ENDPOINT_URL}/cohorts/${cohortId}/delete`)
    .then(resp => resp.json())
    .then(json => {
      dispatch(deleteCohortSuccess(cohortId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
      history.push('/dashboard');
    })
    .catch(err => {
      dispatch(deleteCohortFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, deleting cohort failed..."
      );
      throw err;
    });
};

export const archiveCohort = cohortId => dispatch => {
  dispatch(archiveCohortRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/update`, {
    isArchived: true
  })
    .then(resp => resp.json())
    .then(() => {
      dispatch(archiveCohortSuccess(cohortId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        'Cohort was successfully archived!'
      );
    })
    .catch(err => {
      dispatch(archiveCohortFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, archiving cohort failed..."
      );
    });
};

export const restoreCohort = cohortId => dispatch => {
  dispatch(restoreCohortRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/update`, {
    isArchived: false
  })
    .then(() => getData(`${ENDPOINT_URL}/cohorts/${cohortId}/data`))
    .then(resp => resp.json())
    .then(json => {
      dispatch(restoreCohortSuccess(json, cohortId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        'Cohort was successfully restored!'
      );
    })
    .catch(err => {
      dispatch(restoreCohortFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, restoring cohort failed..."
      );
    });
};

export const fetchCohortDetails = cohortId => dispatch => {
  dispatch(fetchCohortDetailsRequest());
  return getData(`${ENDPOINT_URL}/cohorts/${cohortId}/data`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchCohortDetailsSuccess(json, cohortId)))
    .catch(err => {
      dispatch(fetchCohortDetailsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching data failed..."
      );
      throw err;
    });
};
