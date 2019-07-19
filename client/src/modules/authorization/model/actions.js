import { getData, postData, postRequest } from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { ValidationException } from 'common/exceptions/ValidationException';
import history from 'common/utils/history';

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

export const logoutCurrentUser = () => dispatch =>
  postRequest('/auth/logout')
    .then(() => dispatch(logoutSuccess()))
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
