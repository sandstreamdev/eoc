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

const createCohortSuccess = payload => ({
  type: CohortActionTypes.CREATE_SUCCESS,
  payload
});

const createCohortFailure = errMessage => ({
  type: CohortActionTypes.CREATE_FAILURE,
  errMessage
});

const fetchCohortsMetaDataSuccess = payload => ({
  type: CohortActionTypes.FETCH_META_DATA_SUCCESS,
  payload
});

const fetchCohortsMetaDataFailure = errMessage => ({
  type: CohortActionTypes.FETCH_META_DATA_FAILURE,
  errMessage
});

const updateCohortSuccess = payload => ({
  type: CohortActionTypes.UPDATE_SUCCESS,
  payload
});

const updateCohortFailure = err => ({
  type: CohortActionTypes.UPDATE_FAILURE,
  payload: err.message
});

const archiveCohortSuccess = payload => ({
  type: CohortActionTypes.ARCHIVE_SUCCESS,
  payload
});

const archiveCohortFailure = errMessage => ({
  type: CohortActionTypes.ARCHIVE_FAILURE,
  payload: errMessage
});

const restoreCohortSuccess = payload => ({
  type: CohortActionTypes.RESTORE_SUCCESS,
  payload
});

const restoreCohortFailure = errMessage => ({
  type: CohortActionTypes.RESTORE_FAILURE,
  payload: errMessage
});

const deleteCohortSuccess = payload => ({
  type: CohortActionTypes.DELETE_SUCCESS,
  payload
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

const fetchArchivedCohortsMetaDataSuccess = payload => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload
});

const fetchArchivedCohortsMetaDataFailure = errMessage => ({
  type: CohortActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE,
  payload: errMessage
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

const removeMemberSuccess = (cohortId, userId) => ({
  type: CohortActionTypes.REMOVE_MEMBER_SUCCESS,
  payload: { cohortId, userId }
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

export const removeArchivedCohortsMetaData = () => ({
  type: CohortActionTypes.REMOVE_ARCHIVED_META_DATA
});

export const createCohort = data => dispatch =>
  postData('/api/cohorts/create', data)
    .then(resp => resp.json())
    .then(json => dispatch(createCohortSuccess(json)))
    .catch(err => {
      dispatch(createCohortFailure(err.message));
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
    .catch(err => {
      dispatch(fetchCohortsMetaDataFailure(err.message));
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
    .catch(err => {
      dispatch(fetchArchivedCohortsMetaDataFailure(err.message));
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.fetch-arch-fail'
      });
    });

export const updateCohort = (cohortName, cohortId, data) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/update`, data)
    .then(() => {
      dispatch(updateCohortSuccess({ ...data, cohortId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.update-cohort',
        data: cohortName
      });
      socket.emit(CohortActionTypes.UPDATE_SUCCESS, { ...data, cohortId });
    })
    .catch(err => {
      dispatch(updateCohortFailure(err));
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'cohort.actions.update-cohort-fail',
        data: cohortName
      });
    });

export const deleteCohort = (cohortId, cohortName) => dispatch =>
  deleteData(`/api/cohorts/${cohortId}/delete`)
    .then(() => {
      dispatch(deleteCohortSuccess(cohortId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.delete-cohort',
        data: cohortName
      });
      history.replace('/cohorts');
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
      dispatch(archiveCohortSuccess(cohortId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.archive-cohort',
        data: cohortName
      });
      history.replace('/cohorts');
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
      const data = {
        ...json,
        members: _keyBy(json.members, '_id')
      };
      dispatch(restoreCohortSuccess({ data, _id: cohortId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.restore-cohort',
        data: cohortName
      });
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
    .then(json => {
      const data = {
        ...json,
        members: _keyBy(json.members, '_id')
      };
      dispatch(fetchCohortDetailsSuccess(data, cohortId));
    })
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
    .then(resp => resp.json())
    .then(json => {
      if (json._id) {
        const data = { cohortId, member: json };

        socket.emit(CohortActionTypes.ADD_MEMBER_SUCCESS, data);
        dispatch(addMemberSuccess(data));

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
      dispatch(removeMemberSuccess(cohortId, userId));
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
      socket.emit(CohortActionTypes.ADD_OWNER_ROLE_SUCCESS, {
        cohortId,
        userId
      });
      dispatch(
        addOwnerRoleSuccess({
          cohortId,
          userId,
          isCurrentUserRoleChanging: false
        })
      );
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
      socket.emit(CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
        cohortId,
        userId
      });
      dispatch(
        removeOwnerRoleSuccess({ cohortId, userId, isCurrentUserRoleChanging })
      );
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
      socket.emit(CohortActionTypes.LEAVE_SUCCESS, { cohortId, userId });
      dispatch(leaveCohortSuccess(cohortId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.leave-cohort',
        data: userName
      });
      history.replace('/cohorts');
    })
    .catch(err => {
      dispatch(leaveCohortFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR_NO_RETRY, {
        notificationId: err.message || 'cohort.actions.leave-cohort-fail',
        data: userName
      });
    });

export const lockCohortHeader = (cohortId, { nameLock, descriptionLock }) =>
  socket.emit(CohortHeaderStatusTypes.LOCK, {
    cohortId,
    descriptionLock,
    nameLock
  });

export const unlockCohortHeader = (cohortId, { nameLock, descriptionLock }) =>
  socket.emit(CohortHeaderStatusTypes.UNLOCK, {
    cohortId,
    descriptionLock,
    nameLock
  });
