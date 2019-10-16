import {
  deleteData,
  getData,
  getJson,
  postData,
  postRequest
} from 'common/utils/fetchMethods';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { ValidationException } from 'common/exceptions/ValidationException';
import history from 'common/utils/history';
import {
  accountDeletedRoute,
  asyncTypes,
  enumerable
} from 'common/utils/helpers';

export const AuthorizationActionTypes = enumerable('user')(
  ...asyncTypes('FETCH'),
  ...asyncTypes('LOGIN'),
  ...asyncTypes('LOGOUT'),
  ...asyncTypes('UPDATE_SETTINGS')
);

const logoutSuccess = () => ({
  type: AuthorizationActionTypes.LOGOUT_SUCCESS
});

const logoutFailure = () => ({
  type: AuthorizationActionTypes.LOGOUT_FAILURE
});

const loginSuccess = payload => ({
  type: AuthorizationActionTypes.LOGIN_SUCCESS,
  payload
});

const fetchUserDetailsSuccess = payload => ({
  type: AuthorizationActionTypes.FETCH_SUCCESS,
  payload
});

const fetchUserDetailsFailure = () => ({
  type: AuthorizationActionTypes.FETCH_FAILURE
});

export const removeUserData = () => dispatch => {
  dispatch(logoutSuccess());
  localStorage.clear();
  history.replace(accountDeletedRoute());
};

export const logoutCurrentUser = () => dispatch =>
  postRequest('/auth/logout')
    .then(() => window.location.reload())
    .catch(err => dispatch(logoutFailure(err.message)));

export const loginDemoUser = () => dispatch =>
  postData('/auth/demo', {
    email: 'demo@example.com',
    password: 'demo'
  })
    .then(response => response.json())
    .then(json => {
      dispatch(loginSuccess(json));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'user.actions.login'
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
    .then(response => response.json())
    .then(json => {
      dispatch(loginSuccess(json));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'user.actions.login'
      });
    });

export const getLoggedUser = () => dispatch =>
  getData('/auth/user')
    .then(response => {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        return response.json();
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
        notificationId: 'user.actions.reset',
        data: { email }
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
          notificationId: 'user.actions.recovery-password-default-error',
          data: { email }
        },
        err
      );
    });

export const updatePassword = (token, password, passwordConfirmation) =>
  postData(`/auth/update-password/${token}`, {
    password,
    passwordConfirmation
  }).then(() => history.replace('/password-recovery-success'));

export const fetchUserDetails = () => dispatch =>
  getJson('/auth/user-details')
    .then(json => dispatch(fetchUserDetailsSuccess(json)))
    .catch(err => {
      dispatch(fetchUserDetailsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'user.actions.fetch-user-details-error'
        },
        err
      );
    });

export const changePassword = (password, newPassword, newPasswordConfirm) =>
  postData('/auth/change-password', {
    password,
    newPassword,
    newPasswordConfirm
  });

export const getAccountDetails = token =>
  getJson(`/auth/account-details/${token}`);

export const deleteAccount = (email, password) =>
  deleteData('/auth', { email, password });

export const sendReport = () => dispatch => {
  try {
    const result = getData('/auth/send-report');

    if (result) {
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'email.report.sending-success'
      });
    }
  } catch (error) {
    createNotificationWithTimeout(
      dispatch,
      NotificationType.ERROR,
      {
        notificationId: 'email.report.sending-failure'
      },
      error
    );
  }
};

export const saveEmailReportsSettings = emailReportsFrequency => async dispatch => {
  try {
    const result = await postData('/auth/email-reports-settings', {
      emailReportsFrequency
    });

    if (result) {
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.settings-saved'
      });
    }
  } catch (error) {
    createNotificationWithTimeout(
      dispatch,
      NotificationType.ERROR,
      {
        notificationId: 'common.something-went-wrong'
      },
      error
    );
  }
};

export const reauthenticate = () => {
  console.log('reauth');
  return getData('/auth/reauthenticate');
};
