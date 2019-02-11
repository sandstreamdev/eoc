import { ENDPOINT_URL } from 'common/constants/variables';
import {
  getData,
  postData,
  deleteData,
  onFetchError
} from 'common/utils/fetchMethods';
import { ShoppingListActionTypes } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

// Action creators
const fetchProductsFailure = errMessage => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_FAILURE,
  errMessage
});

const fetchProductSuccess = json => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_SUCCESS,
  products: json
});

const fetchProductRequest = () => ({
  type: ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST
});

const createNewShoppingListSuccess = data => ({
  type: ShoppingListActionTypes.CREATE_SHOPPING_LIST_SUCCESS,
  payload: data
});

const createNewShoppingListFailure = errMessage => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_FAILURE,
  errMessage
});

const createNewShoppingListRequest = () => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_REQUEST
});

const deleteListSuccess = id => ({
  type: ShoppingListActionTypes.DELETE_LIST_SUCCESS,
  id
});

const deleteListFailure = errMessage => ({
  type: ShoppingListActionTypes.DELETE_LIST_FAILURE,
  errMessage
});

const deleteListRequest = () => ({
  type: ShoppingListActionTypes.DELETE_LIST_REQUEST
});

const fetchShoppingListsSuccess = data => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_SUCCESS,
  payload: data
});

const fetchShoppingListsFailure = errMessage => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_FAILURE,
  errMessage
});

const fetchShoppingListsRequest = () => ({
  type: ShoppingListActionTypes.FETCH_SHOPPING_LISTS_REQUEST
});

// Dispatchers
export const fetchProducts = () => dispatch => {
  dispatch(fetchProductRequest());
  return getData(`${ENDPOINT_URL}/items`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchProductSuccess(json)))
    .catch(err => {
      dispatch(fetchProductsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, fetching products failed..."
      );
    });
};

export const createShoppingList = (name, description, adminId) => dispatch => {
  dispatch(createNewShoppingListRequest());
  postData(`${ENDPOINT_URL}/shopping-lists/create`, {
    name,
    description,
    adminId
  })
    .then(resp => resp.json())
    .then(json => dispatch(createNewShoppingListSuccess(json)))
    .catch(err => {
      dispatch(createNewShoppingListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, creating new list failed..."
      );
    });
};

export const fetchShoppingLists = () => dispatch => {
  dispatch(fetchShoppingListsRequest());
  getData(`${ENDPOINT_URL}/shopping-lists`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchShoppingListsSuccess(json)))
    .catch(err => {
      dispatch(fetchShoppingListsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, fetching lists failed..."
      );
    });
};

export const deleteList = (id, successRedirectCallback) => dispatch => {
  dispatch(deleteListRequest());
  deleteData(`${ENDPOINT_URL}/shopping-lists/${id}/delete`)
    .then(resp =>
      resp.text().then(message => {
        if (resp.ok) {
          dispatch(deleteListSuccess());
          createNotificationWithTimeout(
            dispatch,
            NotificationType.SUCCESS,
            message
          );
          successRedirectCallback();
        } else {
          const error = new Error(message);
          error.fromBackend = true;
          throw error;
        }
      })
    )
    .catch(err => {
      const message = err.fromBackend
        ? err.message
        : "Oops, we're sorry, deleting list failed...";
      onFetchError(dispatch, message, () => dispatch(deleteListFailure()));
    });
};
