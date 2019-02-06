import { ENDPOINT_URL } from 'common/constants/variables';
import { getData, postData } from 'common/utils/fetchMethods';
import { ShoppingListActionTypes } from './actionTypes';

// Action creators
export const fetchProductsError = err => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_FAILURE,
  err
});
export const fetchProductsRequest = (json, listId) => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST,
  payload: { products: json, listId }
});
const createNewShoppingListSuccess = data => ({
  type: ShoppingListActionTypes.ADD_SHOPPING_LIST_SUCCESS,
  payload: data
});
const fetchShoppingListsSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_SUCCESS,
  payload: data
});
const fetchShoppingListMetaDataSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_META_DATA_SUCCESS,
  payload: data
});

// Dispatchers
export const fetchProductsFromGivenList = listId => dispatch =>
  getData(`${ENDPOINT_URL}/shopping-lists/${listId}/get-products`)
    .then(resp => resp.json())
    .then(json => {
      const { products } = json[0];
      dispatch(fetchProductsRequest(products, listId));
    })
    .catch(err => dispatch(fetchProductsError(err)));

export const createShoppingList = (name, description, adminId) => dispatch =>
  postData(`${ENDPOINT_URL}/shopping-lists/create`, {
    name,
    description,
    adminId
  })
    .then(resp => resp.json())
    .then(json => dispatch(createNewShoppingListSuccess(json)))
    .catch(err => console.error(err));

export const fetchShoppingLists = () => dispatch => {
  getData(`${ENDPOINT_URL}/shopping-lists`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchShoppingListsSuccess(json)))
    .catch(err => console.err(err));
};

export const fetchShoppingListsMetaData = () => dispatch => {
  getData(`${ENDPOINT_URL}/shopping-lists/meta-data`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchShoppingListMetaDataSuccess(json)))
    .catch(err => console.error(err));
};
