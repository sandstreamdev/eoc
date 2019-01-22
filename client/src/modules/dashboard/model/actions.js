export const FETCH_ALL_SHOPPING_LISTS = 'FETCH_ALL_SHOPPING_LISTS';
export const FETCH_ALL_COHORTS = 'FETCH_ALL_COHORTS';

// Action creators
const fetchShoppingLists = () => ({
  type: FETCH_ALL_SHOPPING_LISTS
});

const fetchCohorts = () => ({
  type: FETCH_ALL_COHORTS
});

// Dispatcher
export const fetchAllLists = () => dispatch => {
  dispatch(fetchShoppingLists());
  dispatch(fetchCohorts());
};
