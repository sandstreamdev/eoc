import { combineReducers } from 'redux';

import { UsersActionTypes } from './actionTypes';

const users = (state = {}, action) => {
  switch (action.type) {
    case UsersActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case UsersActionTypes.REMOVE_SUCCESS: {
      const { [action.payload]: removed, ...rest } = state;
      return rest;
    }
    case UsersActionTypes.COHORT_OWNER_SUCCESS: {
      const { payload: _id } = action;
      return {
        ...state,
        [_id]: { ...state[_id], isOwner: true }
      };
    }
    case UsersActionTypes.COHORT_MEMBER_SUCCESS: {
      const { payload: _id } = action;
      const { isOwner: removed, ...rest } = state[_id];
      return {
        ...state,
        [_id]: rest
      };
    }
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case UsersActionTypes.COHORT_MEMBER_FAILURE:
    case UsersActionTypes.COHORT_MEMBER_SUCCESS:
    case UsersActionTypes.COHORT_OWNER_FAILURE:
    case UsersActionTypes.COHORT_OWNER_SUCCESS:
    case UsersActionTypes.FETCH_FAILURE:
    case UsersActionTypes.FETCH_SUCCESS:
    case UsersActionTypes.REMOVE_FAILURE:
    case UsersActionTypes.REMOVE_SUCCESS:
      return false;
    case UsersActionTypes.COHORT_MEMBER_REQUEST:
    case UsersActionTypes.COHORT_OWNER_REQUEST:
    case UsersActionTypes.FETCH_REQUEST:
    case UsersActionTypes.REMOVE_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: users, isFetching });
