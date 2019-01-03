import { getCookie } from '../../utils/cookie';

// Action types
export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';

// Action creators
export const getCurrentUser = user => ({
  type: FETCH_CURRENT_USER,
  payload: user
});

// Dispatcher
export const fetchCurrentUser = () => dispatch => {
  const user = JSON.parse(decodeURIComponent(getCookie('user')));

  dispatch(getCurrentUser(user));
};
