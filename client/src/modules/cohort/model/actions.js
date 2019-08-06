import _keyBy from 'lodash/keyBy';

import { CohortActionTypes, CohortHeaderStatusTypes } from './actionTypes';
import {
  deleteData,
  getJson,
  patchData,
  postData
} from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import history from 'common/utils/history';
import { UserAddingStatus } from 'common/components/Members/const';
import { ResourceNotFoundException } from 'common/exceptions';
import socket from 'sockets';
import { cohortsRoute } from 'common/utils/helpers';

const createCohortSuccess = payload => ({
  type: CohortActionTypes.CREATE_SUCCESS,
  payload
});

const createCohortFailure = () => ({
  type: CohortActionTypes.CREATE_FAILURE
});

const fetchCohortsMetaDataSuccess = payload => ({
  type: CohortActionTypes.FETCH_META_DATA_SUCCESS,
  payload
});

const fetchCohortsMetaDataFailure = () => ({
  type: CohortActionTypes.FETCH_META_DATA_FAILURE
});

const updateCohortSuccess = payload => ({
  type: CohortActionTypes.UPDATE_SUCCESS,
  payload
});

const updateCohortFailure = () => ({
  type: CohortActionTypes.UPDATE_FAILURE
});

const archiveCohortSuccess = payload => ({
  type: CohortActionTypes.ARCHIVE_SUCCESS,
  payload
});

const archiveCohortFailure = () => ({
  type: CohortActionTypes.ARCHIVE_FAILURE
});

const restoreCohortSuccess = payload => ({
  type: CohortActionTypes.RESTORE_SUCCESS,
  payload
});

const restoreCohortFailure = () => ({
  type: CohortActionTypes.RESTORE_FAILURE
});

const deleteCohortSuccess = payload => ({
  type: CohortActionTypes.DELETE_SUCCESS,
  payload
});

const deleteCohortFailure = () => ({
  type: CohortActionTypes.DELETE_FAILURE
});

const fetchCohortDetailsFailure = () => ({
  type: CohortActionTypes.FETCH_DETAILS_FAILURE
});

const fetchCohortDetailsSuccess = payload => ({
  type: CohortActionTypes.FETCH_DETAILS_SUCCESS,
  payload
});

const fetchArchivedCohortsMetaDataSuccess = payload => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload
});

const fetchArchivedCohortsMetaDataFailure = () => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE
});

const addMemberSuccess = payload => ({
  type: CohortActionTypes.ADD_MEMBER_SUCCESS,
  payload
});

const addMemberFailure = () => ({
  type: CohortActionTypes.ADD_MEMBER_FAILURE
});

const removeMemberFailure = () => ({
  type: CohortActionTypes.REMOVE_MEMBER_FAILURE
});

const removeMemberSuccess = payload => ({
  type: CohortActionTypes.REMOVE_MEMBER_SUCCESS,
  payload
});

const addOwnerRoleFailure = () => ({
  type: CohortActionTypes.ADD_OWNER_ROLE_FAILURE
});

const addOwnerRoleSuccess = payload => ({
  type: CohortActionTypes.ADD_OWNER_ROLE_SUCCESS,
  payload
});

const removeOwnerRoleFailure = () => ({
  type: CohortActionTypes.REMOVE_OWNER_ROLE_FAILURE
});

const removeOwnerRoleSuccess = payload => ({
  type: CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS,
  payload
});

const leaveCohortSuccess = payload => ({
  type: CohortActionTypes.LEAVE_SUCCESS,
  payload
});

const leaveCohortFailure = () => ({
  type: CohortActionTypes.LEAVE_FAILURE
});

const clearMetaDataSuccess = () => ({
  type: CohortActionTypes.CLEAR_META_DATA_SUCCESS
});

export const removeArchivedCohortsMetaData = () => ({
  type: CohortActionTypes.REMOVE_ARCHIVED_META_DATA
});

export const createCohort = data => dispatch =>
  postData('/api/cohorts/create', data)
    .then(response => response.json())
    .then(json => dispatch(createCohortSuccess(json)))
    .catch(() => {
      dispatch(createCohortFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.create-fail',
        data: data.name
      });
    });

export const fetchCohortsMetaData = () => dispatch =>
  getJson('/api/cohorts/meta-data')
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchCohortsMetaDataSuccess(dataMap));
    })
    .catch(() => {
      dispatch(fetchCohortsMetaDataFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.fetch-fail'
      });
    });

export const fetchArchivedCohortsMetaData = () => dispatch =>
  getJson('/api/cohorts/archived')
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedCohortsMetaDataSuccess(dataMap));
    })
    .catch(() => {
      dispatch(fetchArchivedCohortsMetaDataFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.fetch-arch-fail'
      });
    });

export const updateCohort = (cohortName, cohortId, data) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/update`, data)
    .then(() => {
      const action = updateCohortSuccess({ ...data, cohortId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.update-cohort',
        data: cohortName
      });
    })
    .catch(() => {
      dispatch(updateCohortFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.update-cohort-fail',
        data: cohortName
      });
    });

export const deleteCohort = (cohortId, cohortName) => dispatch =>
  deleteData(`/api/cohorts/${cohortId}/delete`)
    .then(resp => resp.json())
    .then(members => {
      const action = deleteCohortSuccess({ cohortId });
      const { type, payload } = action;

      socket.emit(type, { ...payload, members });
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.delete-cohort',
        data: cohortName
      });
      history.replace(cohortsRoute());
    })
    .catch(err => {
      if (!(err instanceof ResourceNotFoundException)) {
        dispatch(deleteCohortFailure());
        createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
          notificationId: 'cohort.actions.delete-cohort-fail',
          data: cohortName
        });
      }
      throw err;
    });

export const archiveCohort = (cohortId, cohortName) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/update`, {
    isArchived: true
  })
    .then(() => {
      const action = archiveCohortSuccess({ cohortId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.archive-cohort',
        data: cohortName
      });
      history.replace(cohortsRoute());
    })
    .catch(() => {
      dispatch(archiveCohortFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.archive-cohort-fail',
        data: cohortName
      });
    });

export const restoreCohort = (cohortId, cohortName) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/update`, {
    isArchived: false
  })
    .then(() => getJson(`/api/cohorts/${cohortId}/data`))
    .then(json => {
      dispatch(restoreCohortSuccess(json));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.restore-cohort',
        data: cohortName
      });
      socket.emit(CohortActionTypes.RESTORE_SUCCESS, { cohortId });
    })
    .catch(err => {
      dispatch(restoreCohortFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.restore-cohort-fail',
        data: cohortName
      });
      throw err;
    });

export const fetchCohortDetails = cohortId => dispatch =>
  getJson(`/api/cohorts/${cohortId}/data`)
    .then(json => dispatch(fetchCohortDetailsSuccess(json)))
    .catch(err => {
      if (!(err instanceof ResourceNotFoundException)) {
        dispatch(fetchCohortDetailsFailure());
        createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
          notificationId: 'cohort.actions.fetch-details-fail'
        });
      }
      throw err;
    });

export const addCohortMember = (cohortId, email) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/add-member`, {
    email
  })
    .then(response => response.json())
    .then(json => {
      if (json._id) {
        const data = { cohortId, member: json };
        const action = addMemberSuccess(data);
        const { type, payload } = action;

        socket.emit(type, payload);
        dispatch(action);

        return UserAddingStatus.ADDED;
      }

      return UserAddingStatus.NO_USER;
    })
    .catch(err => {
      dispatch(addMemberFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: err.message || 'cohort.actions.add-member-default',
        data: email
      });
    });

export const removeCohortMember = (cohortId, userName, userId) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/remove-member`, {
    userId
  })
    .then(() => {
      const action = removeMemberSuccess({ cohortId, userId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.remove-member',
        data: userName
      });
    })
    .catch(() => {
      dispatch(removeMemberFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.remove-member-fail',
        data: userName
      });
    });

export const addOwnerRole = (cohortId, userId, userName) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/add-owner-role`, {
    userId
  })
    .then(() => {
      const action = addOwnerRoleSuccess({ userId, cohortId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);

      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.owner-role',
        data: userName
      });
    })
    .catch(() => {
      dispatch(addOwnerRoleFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.set-owner-fail',
        data: userName
      });
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
    .then(() => {
      const action = removeOwnerRoleSuccess({
        isCurrentUserRoleChanging,
        cohortId,
        userId
      });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.no-owner-role',
        data: userName
      });
    })
    .catch(err => {
      dispatch(removeOwnerRoleFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: err.message || 'cohort.actions.remove-owner-fail',
        data: userName
      });
    });

export const leaveCohort = (cohortId, userId, userName) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/leave-cohort`, { userId })
    .then(() => {
      const action = leaveCohortSuccess({ userId, cohortId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.leave-cohort',
        data: userName
      });
      history.replace(cohortsRoute());
    })
    .catch(err => {
      dispatch(leaveCohortFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR_NO_RETRY, {
        notificationId: err.message || 'cohort.actions.leave-cohort-fail',
        data: userName
      });
    });

export const lockCohortHeader = (
  cohortId,
  userId,
  { nameLock, descriptionLock }
) =>
  socket.emit(CohortHeaderStatusTypes.LOCK, {
    cohortId,
    descriptionLock,
    nameLock,
    userId
  });

export const unlockCohortHeader = (
  cohortId,
  userId,
  { nameLock, descriptionLock }
) =>
  socket.emit(CohortHeaderStatusTypes.UNLOCK, {
    cohortId,
    descriptionLock,
    nameLock,
    userId
  });

export const clearMetaData = () => dispatch => dispatch(clearMetaDataSuccess());
