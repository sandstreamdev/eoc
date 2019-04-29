import { AuthorizationActionTypes } from './actions';

const currentUser = (state = null, action) => {
  switch (action.type) {
    case AuthorizationActionTypes.SET_CURRENT_USER_SUCCESS:
      return action.payload;
    case AuthorizationActionTypes.LOGOUT_USER_SUCCESS:
      return null;
    default:
      return state;
  }
};

export default currentUser;
