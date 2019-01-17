import { getCookie } from 'common/utils/cookie';

// Action types
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

// Action creators
export const mountCurrentUser = user => ({
  type: SET_CURRENT_USER,
  payload: user
});

// Dispatcher
export const setCurrentUser = () => dispatch => {
  const user = JSON.parse(decodeURIComponent(getCookie('user')));
  const payload = typeof user === 'object' ? user : null;

  dispatch(mountCurrentUser(payload));
};
