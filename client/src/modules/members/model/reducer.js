import { combineReducers } from 'redux';

import { MembersActionTypes } from './actionTypes';

const members = (state = {}, action) => {
  switch (action.type) {
    case MembersActionTypes.FETCH_SUCCESS:
      return { ...state, ...action.payload };
    case MembersActionTypes.CLEAR_DATA:
      return {};
    case MembersActionTypes.ADD_SUCCESS: {
      const { avatarUrl, displayName, email, newMemberId } = action.payload;
      return { ...state, [newMemberId]: { avatarUrl, displayName, email } };
    }
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case MembersActionTypes.ADD_SUCCESS:
    case MembersActionTypes.ADD_FAILURE:
    case MembersActionTypes.FETCH_SUCCESS:
    case MembersActionTypes.FETCH_FAILURE:
      return false;
    case MembersActionTypes.FETCH_REQUEST:
    case MembersActionTypes.ADD_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: members, isFetching });
