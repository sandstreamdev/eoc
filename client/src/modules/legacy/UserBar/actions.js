import { ENDPOINT_URL } from 'common/constants/variables';

// Action types
export const LOGOUT_USER = 'LOGOUT_USER';

// Action creators
const logoutUser = () => ({
  type: LOGOUT_USER
});

// Dispatchers
export const logoutCurrentUser = () => dispatch =>
  fetch(`${ENDPOINT_URL}/logout`, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include'
  })
    .then(() => dispatch(logoutUser()))
    .catch(err => {
      throw new Error(err.message);
    });
