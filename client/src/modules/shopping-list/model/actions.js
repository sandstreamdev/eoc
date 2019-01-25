import { ENDPOINT_URL } from 'common/constants/variables';

// Action types
export const FETCH_FAILED = 'FETCH_FAILED';
export const FETCH_ITEMS = 'FETCH_ITEMS';
export const ADD_SHOPPING_LIST_SUCCESS = 'ADD_NEW_SHOPPING_LIST';

// Action creators
export const fetchItemsError = err => ({ type: FETCH_FAILED, err });
export const recieveItems = json => ({ type: FETCH_ITEMS, items: json });
const newShoppingListSuccess = data => ({
  type: ADD_SHOPPING_LIST_SUCCESS,
  payload: data
});

// Dispatchers
export const fetchItems = () => dispatch =>
  fetch(`${ENDPOINT_URL}/items`, { credentials: 'same-origin' })
    .then(resp => resp.json())
    .then(json => dispatch(recieveItems(json)))
    .catch(err => dispatch(fetchItemsError(err)));

export const setNewShoppingList = (name, description) => dispatch =>
  fetch(`${ENDPOINT_URL}/shopping-lists/new-list`, {
    body: JSON.stringify({ name, description }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(resp => resp.json())
    .then(json => dispatch(newShoppingListSuccess(json)))
    .catch(err => console.error(err));
