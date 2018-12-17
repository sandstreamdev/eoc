// Action types
export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';

// Action creators
export const getCurrentUser = () => ({
  type: FETCH_CURRENT_USER
});

// Dispatcher
export const fetchCurrentUser = () => dispatch => {
  dispatch(getCurrentUser());
};
