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
      if (state) {
        const { settings = {} } = state || {};

        return {
          ...state,
          settings: { ...settings, ...updatedSettings }
        };
      }

      return state;
    }
    case AuthorizationActionTypes.LEAVE_PROFILE_VIEW_SUCCESS: {
      return {
        ...state,
        activationDate: undefined,
        email: undefined,
        emailReportsFrequency: undefined,
        isPasswordSet: undefined
      };
    }
    default:
      return state;
  }
};

export default currentUser;
