import { ENDPOINT_URL } from 'common/constants/variables';
import { getData, postData } from 'common/utils/fetchMethods';
import { ShoppingListActionTypes } from '../enum';

// Action creators
export const fetchItemsError = err => ({
  type: ShoppingListActionTypes.FETCH_FAILED,
  err
});
export const recieveItems = json => ({
  type: ShoppingListActionTypes.FETCH_ITEMS,
  items: json
});
const createNewShoppingListSuccess = data => ({
  type: ShoppingListActionTypes.ADD_SHOPPING_LIST_SUCCESS,
  payload: data
});
const fetchShoppingListsSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_ALL_SHOPPING_LISTS_SUCCESS,
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

export const fetchShoppingLists = () => dispatch => {
  getData(`${ENDPOINT_URL}/shopping-lists`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchShoppingListsSuccess(json)))
    .catch(err => console.err(err));
};
