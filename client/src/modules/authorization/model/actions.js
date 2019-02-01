import { getCookie } from 'common/utils/cookie';
import { ENDPOINT_URL } from 'common/constants/variables';
import { postRequest } from 'common/utils/fetchMethods';

export const AuthorizationActionTypes = Object.freeze({
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  LOGOUT_USER: 'LOGOUT_USER'
});

// Action creators
export const mountCurrentUser = user => ({
  type: AuthorizationActionTypes.SET_CURRENT_USER,
  payload: user
});

const logoutUser = () => ({
  type: AuthorizationActionTypes.LOGOUT_USER
});

// Dispatcher
export const setCurrentUser = () => dispatch => {
  const user = JSON.parse(decodeURIComponent(getCookie('user')));
  const payload = typeof user === 'object' ? user : null;

  dispatch(mountCurrentUser(payload));
};

export const logoutCurrentUser = () => dispatch =>
  postRequest(`${ENDPOINT_URL}/logout`)
    .then(() => dispatch(logoutUser()))
    .catch(err => {
      throw new Error(err.message);
    });
