import { checkIfCookieSet } from 'common/utils/cookie';
import { postData, postRequest } from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

export const AuthorizationActionTypes = Object.freeze({
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT_FAILURE: 'LOGOUT_FAILURE',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS'
});

const logoutFailure = () => ({
  type: AuthorizationActionTypes.LOGOUT_FAILURE
});

const logoutSuccess = () => ({
  type: AuthorizationActionTypes.LOGOUT_SUCCESS
});

const loginSuccess = data => ({
  type: AuthorizationActionTypes.LOGIN_SUCCESS,
  payload: data
});

const loginFailure = () => ({
  type: AuthorizationActionTypes.LOGIN_FAILURE
});

export const setCurrentUser = () => {
  const user = JSON.parse(decodeURIComponent(checkIfCookieSet('user')));

  return typeof user === 'object' ? user : null;
};

export const loginUser = () => dispatch =>
  dispatch(loginSuccess(setCurrentUser()));

export const logoutCurrentUser = () => dispatch =>
  postRequest('/auth/logout')
    .then(() => dispatch(logoutSuccess()))
    .catch(err => dispatch(logoutFailure(err.message)));

export const loginDemoUser = () => dispatch =>
  postData('/auth/demo', {
    username: 'demo',
    password: 'demo'
  })
    .then(() => {
      dispatch(loginSuccess(setCurrentUser()));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'authorization.actions.login'
      });
    })
    .catch(err => {
      dispatch(loginFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'authorization.actions.login-failed'
      });
    });

export const signUp = (email, username, password, passwordConfirm) =>
  postData('/auth/sign-up', {
    email,
    password,
    passwordConfirm,
    username
  });

export const resendConfirmationLink = hash =>
  postData('/auth/resend-confirmation-link', {
    hash
  });

export const signIn = (email, password) => dispatch =>
  postData('/auth/sign-in', { email, password })
    .then(() => {
      dispatch(loginSuccess(setCurrentUser()));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'authorization.actions.login'
      });
    })
    .catch(err => {
      dispatch(loginFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'authorization.actions.login-failed'
      });
    });
