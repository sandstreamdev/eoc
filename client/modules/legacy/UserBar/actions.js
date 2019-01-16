import { ENDPOINT_URL, FRONTED_URL } from 'common/constants/variables';

// Action types

// Action creators

// Dispatchers
export const logoutCurrentUser = () =>
  fetch(`${ENDPOINT_URL}/logout`, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include'
  })
    .then(() => window.location.replace(FRONTED_URL))
    .catch(err => {
      throw new Error(err.message);
    });
