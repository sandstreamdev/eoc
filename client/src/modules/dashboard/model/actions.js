import { ENDPOINT_URL } from 'common/constants/variables';

export const FETCH_ALL_SHOPPING_LISTS = 'FETCH_ALL_SHOPPING_LISTS';
export const FETCH_ALL_COHORTS = 'FETCH_ALL_COHORTS';

// Action creators
const fetchShoppingLists = shoppingLists => ({
  type: FETCH_ALL_SHOPPING_LISTS,
  payload: shoppingLists
});

const fetchCohorts = () => ({
  type: FETCH_ALL_COHORTS
});

// Dispatcher
export const fetchAllLists = () => dispatch => {
  fetch(`${ENDPOINT_URL}/shopping-lists`, {
    credentials: 'same-origin'
  })
    .then(resp => resp.json())
    .then(json => console.log(json) && dispatch(fetchShoppingLists(json)));

  dispatch(fetchCohorts());
};
