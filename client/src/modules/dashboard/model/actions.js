import { ENDPOINT_URL } from 'common/constants/variables';
import { getData } from 'common/utils/fetchMethods';

export const FETCH_ALL_SHOPPING_LISTS_SUCCESS =
  'FETCH_ALL_SHOPPING_LISTS_SUCCESS';
export const FETCH_ALL_COHORTS_SUCCESS = 'FETCH_ALL_COHORTS_SUCCESS';

// Action creators
const fetchShoppingListsSuccess = data => ({
  type: FETCH_ALL_SHOPPING_LISTS_SUCCESS,
  payload: data
});

const fetchCohortsSuccess = () => ({
  type: FETCH_ALL_COHORTS_SUCCESS
});

// Dispatcher
export const fetchAllLists = () => dispatch => {
  getData(`${ENDPOINT_URL}/shopping-lists`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchShoppingListsSuccess(json)))
    .catch(err => console.err(err));

  dispatch(fetchCohortsSuccess());
};
