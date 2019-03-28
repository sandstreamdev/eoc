import { combineReducers } from 'redux';

import { MembersActionTypes } from './actionTypes';

const users = (state = {}, action) => {
  switch (action.type) {
    case MembersActionTypes.FETCH_SUCCESS:
      return { ...state, ...action.payload };
    case MembersActionTypes.CLEAR_DATA:
      return {};
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case MembersActionTypes.FETCH_SUCCESS:
    case MembersActionTypes.FETCH_FAILURE:
      return false;
    case MembersActionTypes.FETCH_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: users, isFetching });
