import { ENDPOINT_URL } from 'common/constants/variables';
import { getData, postData } from 'common/utils/fetchMethods';

// Action types
export const FETCH_FAILED = 'FETCH_FAILED';
export const FETCH_ITEMS = 'FETCH_ITEMS';
export const ADD_SHOPPING_LIST_SUCCESS = 'ADD_NEW_SHOPPING_LIST_SUCCESS';

// Action creators
export const fetchItemsError = err => ({ type: FETCH_FAILED, err });
export const recieveItems = json => ({ type: FETCH_ITEMS, items: json });
const createNewShoppingListSuccess = data => ({
  type: ADD_SHOPPING_LIST_SUCCESS,
  payload: data
});

// Dispatchers
export const fetchItems = () => dispatch =>
  getData(`${ENDPOINT_URL}/items`)
    .then(resp => resp.json())
    .then(json => dispatch(recieveItems(json)))
    .catch(err => dispatch(fetchItemsError(err)));

export const createNewShoppingList = (name, description) => dispatch =>
  postData(
    `${ENDPOINT_URL}/shopping-lists/new-list`,
    JSON.stringify({ name, description })
  )
    .then(resp => resp.json())
    .then(json => dispatch(createNewShoppingListSuccess(json)))
    .catch(err => console.error(err));
