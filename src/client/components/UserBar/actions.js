// Action types
export const LOGOUT_USER = 'LOGOUT_USER';

// Action creator
export const unmountCurrentUser = () => ({ type: LOGOUT_USER });

// Dispatchers
export const logoutCurrentUser = () => dispatch => {
  console.log('Logout current user action');
  dispatch(unmountCurrentUser());
};
