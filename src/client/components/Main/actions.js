import { getCookie } from '../../common/utilites';

// Action types
export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';

// Action creators
export const getCurrentUser = user => ({
  type: FETCH_CURRENT_USER,
  payload: user
});

// Dispatcher
export const fetchCurrentUser = () => dispatch => {
  const user = decodeURIComponent(getCookie('user_name'));

  dispatch(getCurrentUser(user));
};
