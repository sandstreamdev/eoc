import { combineReducers } from 'redux';

import { AuthorizationActionTypes } from './actions';

export const data = (state = null, action) => {
  switch (action.type) {
    case AuthorizationActionTypes.SET_CURRENT_USER_SUCCESS:
      return action.payload;
    case AuthorizationActionTypes.LOGOUT_USER_SUCCESS:
      return null;
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case AuthorizationActionTypes.LOGOUT_USER_FAILURE:
    case AuthorizationActionTypes.LOGOUT_USER_SUCCESS:
      return false;
    case AuthorizationActionTypes.LOGOUT_USER_SREQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data, isFetching });
