import { UsersActionTypes } from './actionTypes';
import { getData, patchData } from 'common/utils/fetchMethods';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';
import { ENDPOINT_URL } from 'common/constants/variables';

const fetchUsersRequest = () => ({
  type: UsersActionTypes.FETCH_REQUEST
});

const fetchUsersFailure = () => ({
  type: UsersActionTypes.FETCH_FAILURE
});

const fetchUsersSuccess = data => ({
  type: UsersActionTypes.FETCH_SUCCESS,
  payload: data
});

const removeCohortUserRequest = () => ({
  type: UsersActionTypes.REMOVE_REQUEST
});

const removeCohortUserFailure = () => ({
  type: UsersActionTypes.REMOVE_FAILURE
});

const removeCohortUserSuccess = id => ({
  type: UsersActionTypes.REMOVE_SUCCESS,
  payload: id
});

const setAsCohortOwnerRequest = () => ({
  type: UsersActionTypes.COHORT_OWNER_REQUEST
});

const setAsCohortOwnerFailure = () => ({
  type: UsersActionTypes.COHORT_OWNER_FAILURE
});

const setAsCohortOwnerSuccess = id => ({
  type: UsersActionTypes.COHORT_OWNER_SUCCESS,
  payload: id
});

const setAsCohortMemberRequest = () => ({
  type: UsersActionTypes.COHORT_MEMBER_REQUEST
});

const setAsCohortMemberFailure = () => ({
  type: UsersActionTypes.COHORT_MEMBER_FAILURE
});

const setAsCohortMemberSuccess = id => ({
  type: UsersActionTypes.COHORT_MEMBER_SUCCESS,
  payload: id
});

export const fetchUsers = () => dispatch => {
  dispatch(fetchUsersRequest());
  return getData('path')
    .then(resp => resp.json())
    .then(json => dispatch(fetchUsersSuccess(json)))
    .catch(err => {
      dispatch(fetchUsersFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching users failed..."
      );
    });
};

export const removeCohortUser = (cohortId, userId, isOwner) => dispatch => {
  const url = isOwner
    ? `${ENDPOINT_URL}/cohorts/${cohortId}/remove-owner`
    : `${ENDPOINT_URL}/cohorts/${cohortId}/remove-member`;
  dispatch(removeCohortUserRequest());
  return patchData(url, { userId })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeCohortUserSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(removeCohortUserFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const setAsCohortOwner = (cohortId, userId) => dispatch => {
  dispatch(setAsCohortOwnerRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/set-as-owner`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(setAsCohortOwnerSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(setAsCohortOwnerFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const setAsCohortMember = (cohortId, userId) => dispatch => {
  dispatch(setAsCohortMemberRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/set-as-owner`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(setAsCohortMemberSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(setAsCohortMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};
