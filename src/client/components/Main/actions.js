import { getCookie } from '../../utils/cookie';

// Action types
export const SET_CURRENT_USER = 'SET_CURRENT_USER';

// Action creators
export const getCurrentUser = user => ({
  type: SET_CURRENT_USER,
  payload: user
});

// Dispatcher
export const setCurrentUser = () => dispatch => {
  const user = JSON.parse(decodeURIComponent(getCookie('user')));
  const payload = typeof user === 'object' ? user : null;

  dispatch(getCurrentUser(payload));
};
