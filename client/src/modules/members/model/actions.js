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

const removeCohortUserRequest = () => ({
  type: MembersActionTypes.REMOVE_REQUEST
});

const removeCohortUserFailure = () => ({
  type: MembersActionTypes.REMOVE_FAILURE
});

const removeCohortUserSuccess = id => ({
  type: MembersActionTypes.REMOVE_SUCCESS,
  payload: id
});

const setAsCohortOwnerRequest = () => ({
  type: MembersActionTypes.COHORT_OWNER_REQUEST
});

const setAsCohortOwnerFailure = () => ({
  type: MembersActionTypes.COHORT_OWNER_FAILURE
});

const setAsCohortOwnerSuccess = id => ({
  type: MembersActionTypes.COHORT_OWNER_SUCCESS,
  payload: id
});

const setAsCohortMemberRequest = () => ({
  type: MembersActionTypes.COHORT_MEMBER_REQUEST
});

const setAsCohortMemberFailure = () => ({
  type: MembersActionTypes.COHORT_MEMBER_FAILURE
});

const setAsCohortMemberSuccess = id => ({
  type: MembersActionTypes.COHORT_MEMBER_SUCCESS,
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
