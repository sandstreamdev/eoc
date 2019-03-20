import { checkIfCookieSet } from 'common/utils/cookie';
import { ENDPOINT_URL } from 'common/constants/variables';
import { postRequest } from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

export const AuthorizationActionTypes = Object.freeze({
  LOGOUT_USER_FAILURE: 'LOGOUT_USER_FAILURE',
  LOGOUT_USER_REQUEST: 'LOGOUT_USER_REQUEST',
  LOGOUT_USER_SUCCESS: 'LOGOUT_USER_SUCCESS',
  SET_CURRENT_USER_SUCCESS: 'SET_CURRENT_USER_SUCCESS'
});

const setCurrentUserSuccess = user => ({
  type: AuthorizationActionTypes.SET_CURRENT_USER_SUCCESS,
  payload: user
});

const logoutUserFailure = errorMessage => ({
  type: AuthorizationActionTypes.LOGOUT_USER_FAILURE,
  errorMessage
});
const logoutUserSuccess = () => ({
  type: AuthorizationActionTypes.LOGOUT_USER_SUCCESS
});
const logoutUserRequest = () => ({
  type: AuthorizationActionTypes.LOGOUT_USER_REQUEST
});

export const setCurrentUser = () => dispatch => {
  const user = JSON.parse(decodeURIComponent(checkIfCookieSet('user')));
  const payload = typeof user === 'object' ? user : null;

  dispatch(setCurrentUserSuccess(payload));
};

export const logoutCurrentUser = () => dispatch => {
  dispatch(logoutUserRequest());
  return postRequest(`${ENDPOINT_URL}/logout`)
    .then(() => dispatch(logoutUserSuccess()))
    .catch(err => {
      dispatch(logoutUserFailure(err.message));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, logout failed..."
      );
    });
};
