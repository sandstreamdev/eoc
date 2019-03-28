import { combineReducers } from 'redux';

import { UsersActionTypes } from './actionTypes';

const users = (state = {}, action) => {
  switch (action.type) {
    case UsersActionTypes.FETCH_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case UsersActionTypes.FETCH_SUCCESS:
    case UsersActionTypes.FETCH_FAILURE:
      return false;
    case UsersActionTypes.FETCH_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: users, isFetching });
