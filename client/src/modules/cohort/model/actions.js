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

export const removeArchivedCohortsMetaData = () => ({
  type: CohortActionTypes.REMOVE_ARCHIVED_META_DATA
});

export const createCohort = data => dispatch =>
  postData('/api/cohorts/create', data)
    .then(response => response.json())
    .then(json => dispatch(createCohortSuccess(json)))
    .catch(err => {
      const { name } = data;

      dispatch(createCohortFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'cohort.actions.create-fail',
          data: { name }
        },
        err
      );
    });

export const fetchCohortsMetaData = () => dispatch =>
  getJson('/api/cohorts/meta-data')
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchCohortsMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchCohortsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'cohort.actions.fetch-fail'
        },
        err
      );
    });

export const fetchArchivedCohortsMetaData = () => dispatch =>
  getJson('/api/cohorts/archived')
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedCohortsMetaDataSuccess(dataMap));
    })
    .catch(err => {
      dispatch(fetchArchivedCohortsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'cohort.actions.fetch-arch-fail'
        },
        err
      );
    });

export const updateCohort = (name, cohortId, data) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/update`, data)
    .then(() => {
      dispatch(updateCohortSuccess({ ...data, cohortId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.update-cohort',
        data: { name }
      });
    })
    .catch(err => {
      dispatch(updateCohortFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'cohort.actions.update-cohort-fail',
          data: { name }
        },
        err
      );
    });

export const deleteCohort = (cohortId, name) => dispatch =>
  deleteData(`/api/cohorts/${cohortId}`)
    .then(() => {
      dispatch(deleteCohortSuccess({ cohortId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.delete-cohort',
        data: { name }
      });
      history.replace(cohortsRoute());
    })
    .catch(err => {
      if (!(err instanceof ResourceNotFoundException)) {
        dispatch(deleteCohortFailure());
        createNotificationWithTimeout(
          dispatch,
          NotificationType.ERROR,
          {
            notificationId: 'cohort.actions.delete-cohort-fail',
            data: { name }
          },
          err
        );
      }
      throw err;
    });

export const archiveCohort = (cohortId, name) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/archive`)
    .then(() => {
      dispatch(archiveCohortSuccess({ cohortId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.archive-cohort',
        data: { name }
      });
      history.replace(cohortsRoute());
    })
    .catch(err => {
      dispatch(archiveCohortFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'cohort.actions.archive-cohort-fail',
          data: { name }
        },
        err
      );
    });

export const restoreCohort = (cohortId, name) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/restore`)
    .then(() => getJson(`/api/cohorts/${cohortId}/data`))
    .then(data => {
      dispatch(restoreCohortSuccess({ cohortId, data }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.restore-cohort',
        data: { name }
      });
    })
    .catch(err => {
      dispatch(restoreCohortFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'cohort.actions.restore-cohort-fail',
          data: { name }
        },
        err
      );
      throw err;
    });

export const fetchCohortDetails = cohortId => dispatch =>
  getJson(`/api/cohorts/${cohortId}/data`)
    .then(json => dispatch(fetchCohortDetailsSuccess(json)))
    .catch(err => {
      if (!(err instanceof ResourceNotFoundException)) {
        dispatch(fetchCohortDetailsFailure());
        createNotificationWithTimeout(
          dispatch,
          NotificationType.ERROR,
          {
            notificationId: 'cohort.actions.fetch-details-fail'
          },
          err
        );
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

        dispatch(addMemberSuccess(data));

        return UserAddingStatus.ADDED;
      }

      return UserAddingStatus.NO_USER;
    })
    .catch(err => {
      dispatch(addMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: err.message || 'cohort.actions.add-member-default',
          data: { email }
        },
        err
      );
    });

export const removeCohortMember = (cohortId, userName, userId) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/remove-member`, {
    userId
  })
    .then(() => {
      dispatch(removeMemberSuccess({ cohortId, userId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.remove-member',
        data: { userName }
      });
    })
    .catch(err => {
      dispatch(removeMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'cohort.actions.remove-member-fail',
          data: { userName }
        },
        err
      );
    });

export const addOwnerRole = (cohortId, userId, userName) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/add-owner-role`, {
    userId
  })
    .then(() => {
      dispatch(addOwnerRoleSuccess({ userId, cohortId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.owner-role',
        data: { userName }
      });
    })
    .catch(err => {
      dispatch(addOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'cohort.actions.set-owner-fail',
          data: { userName }
        },
        err
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
    .then(() => {
      dispatch(
        removeOwnerRoleSuccess({
          isCurrentUserRoleChanging,
          cohortId,
          userId
        })
      );
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.no-owner-role',
        data: { userName }
      });
    })
    .catch(err => {
      dispatch(removeOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: err.message || 'cohort.actions.remove-owner-fail',
          data: { userName }
        },
        err
      );
    });

export const leaveCohort = (cohortId, userId, userName) => dispatch =>
  patchData(`/api/cohorts/${cohortId}/leave-cohort`)
    .then(() => {
      dispatch(leaveCohortSuccess({ userId, cohortId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'cohort.actions.leave-cohort',
        data: { userName }
      });
      history.replace(cohortsRoute());
    })
    .catch(err => {
      dispatch(leaveCohortFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR_NO_RETRY,
        {
          notificationId: err.message || 'cohort.actions.leave-cohort-fail',
          data: { userName }
        },
        err
      );
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
