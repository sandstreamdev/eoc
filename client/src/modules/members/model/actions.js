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

const removeMemberRequest = () => ({
  type: MembersActionTypes.REMOVE_REQUEST
});

const removeMemberFailure = () => ({
  type: MembersActionTypes.REMOVE_FAILURE
});

const removeMemberSuccess = id => ({
  type: MembersActionTypes.REMOVE_SUCCESS,
  payload: id
});

const changeToOwnerRequest = () => ({
  type: MembersActionTypes.CHANGE_TO_OWNER_REQUEST
});

const changeToOwnerFailure = () => ({
  type: MembersActionTypes.CHANGE_TO_OWNER_FAILURE
});

const changeToOwnerSuccess = id => ({
  type: MembersActionTypes.CHANGE_TO_OWNER_SUCCESS,
  payload: id
});

const changeToMemberRequest = () => ({
  type: MembersActionTypes.CHANGE_TO_MEMBER_REQUEST
});

const changeToMemberFailure = () => ({
  type: MembersActionTypes.CHANGE_TO_MEMBER_FAILURE
});

const changeToMemberSuccess = id => ({
  type: MembersActionTypes.CHANGE_TO_MEMBER_SUCCESS,
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

export const removeCohortMember = (cohortId, userId, isOwner) => dispatch => {
  const url = isOwner
    ? `${ENDPOINT_URL}/cohorts/${cohortId}/remove-owner`
    : `${ENDPOINT_URL}/cohorts/${cohortId}/remove-member`;
  dispatch(removeMemberRequest());
  return patchData(url, { userId })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeMemberSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
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
};

export const changeToCohortOwner = (cohortId, userId) => dispatch => {
  dispatch(changeToOwnerRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/change-to-owner`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(changeToOwnerSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(changeToOwnerFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const changeToCohortMember = (cohortId, userId) => dispatch => {
  dispatch(changeToMemberRequest());
  return patchData(`${ENDPOINT_URL}/cohorts/${cohortId}/change-to-member`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(changeToMemberSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(changeToMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const fetchListMembers = cohortId => dispatch => {
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

export const addListMember = (listId, email) => dispatch => {
  dispatch(addMemberRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/add-member`, {
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

export const removeListMember = (listId, userId, isOwner) => dispatch => {
  const url = isOwner
    ? `${ENDPOINT_URL}/lists/${listId}/remove-owner`
    : `${ENDPOINT_URL}/lists/${listId}/remove-member`;
  dispatch(removeMemberRequest());
  return patchData(url, { userId })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeMemberSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
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
};

export const changeToListOwner = (listId, userId) => dispatch => {
  dispatch(changeToOwnerRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/change-to-owner`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(changeToOwnerSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(changeToOwnerFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const changeToListMember = (listId, userId) => dispatch => {
  dispatch(changeToMemberRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/change-to-member`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(changeToMemberSuccess(userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(changeToMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};
