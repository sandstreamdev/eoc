import { AuthorizationActionTypes } from './actions';

const currentUser = (state = null, action) => {
  switch (action.type) {
    case AuthorizationActionTypes.LOGIN_SUCCESS:
      return action.payload;
    case AuthorizationActionTypes.LOGOUT_SUCCESS:
      return null;
    case AuthorizationActionTypes.FETCH_SUCCESS:
      return { ...(state || {}), ...action.payload };
    case AuthorizationActionTypes.UPDATE_SETTINGS_SUCCESS: {
      const { payload: updatedSettings } = action;
      const { settings } = state;

      return { ...state, settings: { ...settings, ...updatedSettings } };
    }
    default:
      return state;
  }
};

export default currentUser;
