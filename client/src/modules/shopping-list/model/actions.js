import _keyBy from 'lodash/keyBy';

import { ENDPOINT_URL } from 'common/constants/variables';
import { getData, postData } from 'common/utils/fetchMethods';
import { ShoppingListActionTypes } from './actionTypes';

// Action creators
export const fetchProductsError = err => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_FAILURE,
  err
});
export const fetchProductsSuccess = (json, listId) => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_SUCCESS,
  payload: { products: json, listId }
});
const createNewShoppingListSuccess = data => ({
  type: ShoppingListActionTypes.ADD_SUCCESS,
  payload: data
});
const fetchShoppingListMetaDataSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_META_DATA_SUCCESS,
  payload: data
});

// Dispatchers
export const fetchItemsFromGivenList = listId => dispatch =>
  getData(`${ENDPOINT_URL}/shopping-lists/${listId}/products`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchProductsSuccess(json, listId)))
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

export const fetchShoppingListsMetaData = () => dispatch => {
  getData(`${ENDPOINT_URL}/shopping-lists/meta-data`)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchShoppingListMetaDataSuccess(dataMap));
    })
    .catch(err => console.error(err));
};
