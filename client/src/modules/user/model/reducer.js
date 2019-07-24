import { AuthorizationActionTypes } from './actions';

const currentUser = (state = null, action) => {
  switch (action.type) {
    case AuthorizationActionTypes.LOGIN_SUCCESS:
      return action.payload;
    case AuthorizationActionTypes.LOGOUT_SUCCESS:
      return null;
    case AuthorizationActionTypes.FETCH_SUCCESS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default currentUser;
