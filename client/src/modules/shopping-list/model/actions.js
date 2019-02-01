import { ENDPOINT_URL } from 'common/constants/variables';
import { getData, postData } from 'common/utils/fetchMethods';
import { ShoppingListActionTypes } from './actionTypes';

// Action creators
export const fetchProductsError = err => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_FAILURE,
  err
});
export const recieveProducts = json => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST,
  products: json
});
const createNewShoppingListSuccess = data => ({
  type: ShoppingListActionTypes.ADD_SHOPPING_LIST_SUCCESS,
  payload: data
});
const fetchShoppingListsSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_SUCCESS,
  payload: data
});

// Dispatchers
export const fetchProducts = () => dispatch =>
  getData(`${ENDPOINT_URL}/items`)
    .then(resp => resp.json())
    .then(json => dispatch(recieveProducts(json)))
    .catch(err => dispatch(fetchProductsError(err)));

export const createNewShoppingList = (name, description) => dispatch =>
  postData(`${ENDPOINT_URL}/shopping-lists/new-list`, { name, description })
    .then(resp => resp.json())
    .then(json => dispatch(createNewShoppingListSuccess(json)))
    .catch(err => console.error(err));

export const fetchShoppingLists = () => dispatch => {
  getData(`${ENDPOINT_URL}/shopping-lists`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchShoppingListsSuccess(json)))
    .catch(err => console.err(err));
};
