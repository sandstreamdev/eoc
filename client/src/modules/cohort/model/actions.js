import _keyBy from 'lodash/keyBy';

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
import { UserAddingStatus } from 'common/components/Members/const';

const createCohortSuccess = data => ({
  type: CohortActionTypes.CREATE_SUCCESS,
  payload: data
});

const createCohortFailure = errMessage => ({
  type: CohortActionTypes.CREATE_FAILURE,
  errMessage
});

const fetchCohortsMetaDataSuccess = data => ({
  type: CohortActionTypes.FETCH_META_DATA_SUCCESS,
  payload: data
});

const fetchCohortsMetaDataFailure = errMessage => ({
  type: CohortActionTypes.FETCH_META_DATA_FAILURE,
  errMessage
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

const restoreCohortSuccess = (data, _id) => ({
  type: CohortActionTypes.RESTORE_SUCCESS,
  payload: { data, _id }
});

const restoreCohortFailure = errMessage => ({
  type: CohortActionTypes.RESTORE_FAILURE,
  payload: errMessage
});

const deleteCohortSuccess = _id => ({
  type: CohortActionTypes.DELETE_SUCCESS,
  payload: _id
});

const deleteCohortFailure = errMessage => ({
  type: CohortActionTypes.DELETE_FAILURE,
  payload: errMessage
});

const fetchCohortDetailsFailure = errMessage => ({
  type: CohortActionTypes.FETCH_DETAILS_FAILURE,
  payload: errMessage
});

const fetchCohortDetailsSuccess = (data, _id) => ({
  type: CohortActionTypes.FETCH_DETAILS_SUCCESS,
  payload: { data, _id }
});

const fetchArchivedCohortsMetaDataSuccess = data => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload: data
});

const fetchArchivedCohortsMetaDataFailure = errMessage => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE,
  payload: errMessage
});

const addMemberSuccess = (data, cohortId) => ({
  type: CohortActionTypes.ADD_MEMBER_SUCCESS,
  payload: { cohortId, data }
});

const addMemberFailure = () => ({
  type: CohortActionTypes.ADD_MEMBER_FAILURE
});

const removeMemberFailure = () => ({
  type: CohortActionTypes.REMOVE_MEMBER_FAILURE
});

const removeMemberSuccess = (cohortId, userId) => ({
  type: CohortActionTypes.REMOVE_MEMBER_SUCCESS,
  payload: { cohortId, userId }
});

const addOwnerRoleFailure = () => ({
  type: CohortActionTypes.ADD_OWNER_ROLE_FAILURE
});

const addOwnerRoleSuccess = (cohortId, userId) => ({
  type: CohortActionTypes.ADD_OWNER_ROLE_SUCCESS,
  payload: { cohortId, userId }
});

const removeOwnerRoleFailure = () => ({
  type: CohortActionTypes.REMOVE_OWNER_ROLE_FAILURE
});

const removeOwnerRoleSuccess = (
  cohortId,
  userId,
  isCurrentUserRoleChanging
) => ({
  type: CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS,
  payload: { cohortId, isCurrentUserRoleChanging, userId }
});

export const removeArchivedCohortsMetaData = () => ({
  type: CohortActionTypes.REMOVE_ARCHIVED_META_DATA
});

export const createCohort = data => dispatch =>
  postData('/api/cohorts/create', data)
    .then(resp => resp.json())
    .then(json => dispatch(createCohortSuccess(json)))
    .catch(err => {
      dispatch(createCohortFailure(err.message));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to create new cohort: "${data.name}".`
      );
    });

export const fetchCohortsMetaData = () => dispatch =>
  getData('/api/cohorts/meta-data')
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
        'Failed to fetch cohorts data. Please try again.'
      );
    });

export const fetchArchivedCohortsMetaData = () => dispatch =>
  getData('/api/cohorts/archived')
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
        'Failed to fetch cohorts data. Please try again.'
      );
    });

export const updateCohort = (cohortName, cohortId, data) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/update`, data)
    .then(() => {
      dispatch(updateCohortSuccess({ ...data, cohortId }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Cohort: "${cohortName}" successfully updated.`
      );
    })
    .catch(err => {
      dispatch(updateCohortFailure(err));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to update: "${cohortName}" cohort.`
      );
    });

export const deleteCohort = cohortId => dispatch =>
  deleteData(`/api/cohorts/${cohortId}/delete`)
    .then(resp => resp.json())
    .then(json => {
      dispatch(deleteCohortSuccess(cohortId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
      history.replace('/cohorts');
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

export const archiveCohort = cohortId => dispatch =>
  patchData(`/api/cohorts/${cohortId}/update`, {
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

export const restoreCohort = cohortId => dispatch =>
  patchData(`/api/cohorts/${cohortId}/update`, {
    isArchived: false
  })
    .then(() => getData(`/api/cohorts/${cohortId}/data`))
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

export const fetchCohortDetails = cohortId => dispatch =>
  getData(`/api/cohorts/${cohortId}/data`)
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

export const addCohortMember = (cohortId, email) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/add-member`, {
    email
  })
    .then(resp => {
      if (resp.status === 200) {
        return resp.json();
      }
    })
    .then(json => {
      if (json) {
        dispatch(addMemberSuccess(json, cohortId));

        return UserAddingStatus.ADDED;
      }

      return UserAddingStatus.NO_USER;
    })
    .catch(err => {
      dispatch(addMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, adding new member failed..."
      );
    });

export const removeCohortMember = (cohortId, userName, userId) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/remove-member`, {
    userId
  })
    .then(resp => resp.json())
    .then(() => {
      dispatch(removeMemberSuccess(cohortId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `"${userName}" successfully removed.`
      );
    })
    .catch(err => {
      dispatch(removeMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const addOwnerRole = (cohortId, userId, userName) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/add-owner-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addOwnerRoleSuccess(cohortId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `"${userName}" has owner role.`
      );
    })
    .catch(err => {
      dispatch(addOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const removeOwnerRole = (
  cohortId,
  userId,
  userName,
  isCurrentUserRoleChanging
) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/remove-owner-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(
        removeOwnerRoleSuccess(cohortId, userId, isCurrentUserRoleChanging)
      );
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `"${userName}" has no owner role.`
      );
    })
    .catch(err => {
      dispatch(removeOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
