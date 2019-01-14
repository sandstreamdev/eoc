import { ENDPOINT_URL } from '../../common/variables';

// Action types
export const LOGOUT_USER = 'LOGOUT_USER';

// Action creator
export const unmountCurrentUser = () => ({ type: LOGOUT_USER });

// Dispatchers
export const logoutCurrentUser = () => dispatch =>
  fetch(`${ENDPOINT_URL}/logout`, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include'
  })
    .then(() => dispatch(unmountCurrentUser()))
    .catch(err => {
      throw new Error(err.message);
    });
