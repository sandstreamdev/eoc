import { getData, postData, postRequest } from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { ValidationException } from 'common/exceptions/ValidationException';
import history from 'common/utils/history';

export const AuthorizationActionTypes = Object.freeze({
  FETCH_SUCCESS: 'user/FETCH_SUCCESS',
  LOGIN_FAILURE: 'user/LOGIN_FAILURE',
  LOGIN_SUCCESS: 'user/LOGIN_SUCCESS',
  LOGOUT_FAILURE: 'user/LOGOUT_FAILURE'
});

const logoutFailure = () => ({
  type: AuthorizationActionTypes.LOGOUT_FAILURE
});

const loginSuccess = data => ({
  type: AuthorizationActionTypes.LOGIN_SUCCESS,
  payload: data
});

const fetchUserDetailsSuccess = data => ({
  type: AuthorizationActionTypes.FETCH_SUCCESS,
  payload: data
});

const fetchUserDetailsFailure = () => ({
  type: AuthorizationActionTypes.FETCH_FAILURE
});

export const logoutCurrentUser = () => dispatch =>
  postRequest('/auth/logout')
    .then(() => window.location.reload())
    .catch(err => dispatch(logoutFailure(err.message)));

export const loginDemoUser = () => dispatch =>
  postData('/auth/demo', {
    email: 'demo@example.com',
    password: 'demo'
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(loginSuccess(json));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'authorization.actions.login'
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
    .then(resp => resp.json())
    .then(json => {
      dispatch(loginSuccess(json));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'authorization.actions.login'
      });
    });

export const getLoggedUser = () => dispatch =>
  getData('/auth/user')
    .then(resp => {
      const contentType = resp.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        return resp.json();
      }
    })
    .then(json => {
      if (json) {
        dispatch(loginSuccess(json));
      }
    });

export const resetPassword = email => dispatch =>
  postData('/auth/reset-password', { email })
    .then(() => {
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'authorization.actions.reset',
        data: email
      });
    })
    .catch(err => {
      if (err instanceof ValidationException) {
        throw new Error();
      }

      createNotificationWithTimeout(
        dispatch,
        err.message ? NotificationType.ERROR_NO_RETRY : NotificationType.ERROR,
        {
          notificationId:
            'authorization.actions.recovery-password-default-error',
          data: email
        }
      );
    });

export const updatePassword = (token, password, passwordConfirmation) =>
  postData(`/auth/update-password/${token}`, {
    password,
    passwordConfirmation
  }).then(() => history.replace('/password-recovery-success'));

export const resendRecoveryLink = token =>
  postData(`/auth/resend-recovery-link/${token}`);

export const fetchUserDetails = userName => dispatch =>
  getData('/auth/user-details')
    .then(resp => resp.json())
    .then(json => dispatch(fetchUserDetailsSuccess(json)))
    .catch(() => {
      dispatch(fetchUserDetailsFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId:
          'authorization.user-profile.action.fetch-user-details-error'
      });
    });
