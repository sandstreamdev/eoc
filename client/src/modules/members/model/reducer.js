import { combineReducers } from 'redux';

import { MembersActionTypes } from './actionTypes';

const members = (state = {}, action) => {
  switch (action.type) {
    case MembersActionTypes.FETCH_SUCCESS:
      return { ...state, ...action.payload };
    case MembersActionTypes.CLEAR_DATA:
      return {};
    case MembersActionTypes.ADD_SUCCESS: {
      const { _id, avatarUrl, displayName, isOwner } = action.payload;
      return { ...state, [_id]: { _id, avatarUrl, displayName, isOwner } };
    }
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case MembersActionTypes.ADD_FAILURE:
    case MembersActionTypes.ADD_SUCCESS:
    case MembersActionTypes.FETCH_FAILURE:
    case MembersActionTypes.FETCH_SUCCESS:
      return false;
    case MembersActionTypes.ADD_REQUEST:
    case MembersActionTypes.FETCH_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: members, isFetching });
