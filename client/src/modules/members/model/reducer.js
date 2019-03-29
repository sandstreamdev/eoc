import { combineReducers } from 'redux';

import { MembersActionTypes } from './actionTypes';

const members = (state = {}, action) => {
  switch (action.type) {
    case MembersActionTypes.REMOVE_SUCCESS: {
      const { [action.payload]: removed, ...rest } = state;
      return rest;
    }
    case MembersActionTypes.COHORT_OWNER_SUCCESS: {
      const { payload: _id } = action;
      return { ...state, [_id]: { ...state[_id], isOwner: true } };
    }
    case MembersActionTypes.COHORT_MEMBER_SUCCESS: {
      const { payload: _id } = action;
      const { isOwner: removed, ...rest } = state[_id];
      return { ...state, [_id]: rest };
    }
    case MembersActionTypes.FETCH_SUCCESS:
      return { ...state, ...action.payload };
    case MembersActionTypes.CLEAR_DATA:
      return {};
    case MembersActionTypes.ADD_SUCCESS: {
      const { avatarUrl, displayName, email, newMemberId } = action.payload;
      return {
        ...state,
        [newMemberId]: { avatarUrl, displayName, email, _id: newMemberId }
      };
    }
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case MembersActionTypes.ADD_FAILURE:
    case MembersActionTypes.ADD_SUCCESS:
    case MembersActionTypes.COHORT_MEMBER_FAILURE:
    case MembersActionTypes.COHORT_MEMBER_SUCCESS:
    case MembersActionTypes.COHORT_OWNER_FAILURE:
    case MembersActionTypes.COHORT_OWNER_SUCCESS:
    case MembersActionTypes.FETCH_FAILURE:
    case MembersActionTypes.FETCH_SUCCESS:
    case MembersActionTypes.REMOVE_FAILURE:
    case MembersActionTypes.REMOVE_SUCCESS:
      return false;
    case MembersActionTypes.ADD_REQUEST:
    case MembersActionTypes.COHORT_MEMBER_REQUEST:
    case MembersActionTypes.COHORT_OWNER_REQUEST:
    case MembersActionTypes.FETCH_REQUEST:
    case MembersActionTypes.REMOVE_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: members, isFetching });
