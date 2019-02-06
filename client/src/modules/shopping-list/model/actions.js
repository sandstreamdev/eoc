import { ENDPOINT_URL } from 'common/constants/variables';
import { getData, postData } from 'common/utils/fetchMethods';
import { ShoppingListActionTypes } from './actionTypes';

// Action creators
export const fetchProductsError = errMessage => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_FAILURE,
  errMessage
});
export const recieveProducts = json => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST,
  products: json
});
const createNewShoppingListSuccess = data => ({
  type: ShoppingListActionTypes.CREATE_SHOPPING_LIST_SUCCESS,
  payload: data
});
const createNewShoppingListFailure = errMessage => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_FAILURE,
  errMessage
});
const fetchShoppingListsSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_SUCCESS,
  payload: data
});
const fetchShoppingListsFailure = errMessage => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_SUCCESS,
  errMessage
});

// Dispatchers
export const fetchProducts = () => dispatch =>
  getData(`${ENDPOINT_URL}/items`)
    .then(resp => resp.json())
    .then(json => dispatch(recieveProducts(json)))
    .catch(err => dispatch(fetchProductsError(err.message || 'error')));

export const createShoppingList = (name, description, adminId) => dispatch =>
  postData(`${ENDPOINT_URL}/shopping-lists/create`, {
    name,
    description,
    adminId
  })
    .then(resp => resp.json())
    .then(json => dispatch(createNewShoppingListSuccess(json)))
    .catch(err =>
      dispatch(createNewShoppingListFailure(err.message || 'error'))
    );

export const fetchShoppingLists = () => dispatch => {
  getData(`${ENDPOINT_URL}/shopping-lists`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchShoppingListsSuccess(json)))
    .catch(err => dispatch(fetchShoppingListsFailure(err.message || 'error')));
};
