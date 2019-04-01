import _keyBy from 'lodash/keyBy';

import { MembersActionTypes } from './actionTypes';
import { getData, patchData } from 'common/utils/fetchMethods';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { MessageType as NotificationType } from 'common/constants/enums';
import { ENDPOINT_URL } from 'common/constants/variables';

const fetchMembersRequest = () => ({
  type: MembersActionTypes.FETCH_REQUEST
});

const fetchMembersFailure = () => ({
  type: MembersActionTypes.FETCH_FAILURE
});

const fetchMembersSuccess = data => ({
  type: MembersActionTypes.FETCH_SUCCESS,
  payload: data
});

const clearMembersRequest = () => ({
  type: MembersActionTypes.CLEAR_DATA
});

const addMemberRequest = () => ({
  type: MembersActionTypes.ADD_REQUEST
});

const addMemberSuccess = data => ({
  type: MembersActionTypes.ADD_SUCCESS,
  payload: data
});

const addMemberFailure = () => ({
  type: MembersActionTypes.ADD_FAILURE
});

const removeUserRequest = () => ({
  type: MembersActionTypes.REMOVE_REQUEST
});

const removeUserFailure = () => ({
  type: MembersActionTypes.REMOVE_FAILURE
});

const removeUserSuccess = id => ({
  type: MembersActionTypes.REMOVE_SUCCESS,
  payload: id
});

const setAsOwnerRequest = () => ({
  type: MembersActionTypes.OWNER_REQUEST
});

const setAsOwnerFailure = () => ({
  type: MembersActionTypes.OWNER_FAILURE
});

const setAsOwnerSuccess = id => ({
  type: MembersActionTypes.OWNER_SUCCESS,
  payload: id
});

const setAsMemberRequest = () => ({
  type: MembersActionTypes.MEMBER_REQUEST
});

const setAsMemberFailure = () => ({
  type: MembersActionTypes.MEMBER_FAILURE
});

const setAsMemberSuccess = id => ({
  type: MembersActionTypes.MEMBER_SUCCESS,
  payload: id
});

export const fetchCohortMembers = cohortId => dispatch => {
  dispatch(fetchMembersRequest());
  return getData(`${ENDPOINT_URL}/cohorts/${cohortId}/get-members`)
    .then(resp => resp.json())
    .then(json => {
      const data = _keyBy(json, '_id');
      dispatch(fetchMembersSuccess(data));
    })
    .catch(err => {
      dispatch(fetchMembersFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching members failed..."
      );
    });
};

export const clearMembers = () => dispatch => dispatch(clearMembersRequest());

export const addCohortMember = (cohortId, email) => dispatch => {
  dispatch(addMemberRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/add-member`, {
    email
  })
    .then(resp => resp.json())
    .then(json => dispatch(addMemberSuccess(json)))
    .catch(err => {
      dispatch(addMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, adding new member failed..."
      );
    });
};

export const removeCohortUser = (cohortId, userId, isOwner) => dispatch => {
  const url = isOwner
    ? `${ENDPOINT_URL}/cohorts/${cohortId}/remove-owner`
    : `${ENDPOINT_URL}/cohorts/${cohortId}/remove-member`;
  dispatch(removeUserRequest());
  return patchData(url, { userId })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeUserSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(removeUserFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const setAsCohortOwner = (cohortId, userId) => dispatch => {
  dispatch(setAsOwnerRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/set-as-owner`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(setAsOwnerSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(setAsOwnerFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const setAsCohortMember = (cohortId, userId) => dispatch => {
  dispatch(setAsMemberRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/set-as-member`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(setAsMemberSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(setAsMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};
