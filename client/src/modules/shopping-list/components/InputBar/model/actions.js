import { ENDPOINT_URL } from 'common/constants/variables';
import { postData } from 'common/utils/fetchMethods';
import { ProductActionTypes } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

// Action creators
const addProductFailure = errorMessage => ({
  type: ProductActionTypes.ADD_PRODUCT_FAILURE,
  payload: errorMessage
});
export const addProductSuccess = (product, listId) => ({
  type: ProductActionTypes.ADD_PRODUCT_SUCCESS,
  payload: { product, listId }
});
const addProductRequest = () => ({
  type: ProductActionTypes.ADD_PRODUCT_REQUEST
});

// Dispatchers
export const addProductToList = (product, listId) => dispatch => {
  dispatch(addProductRequest());
  postData(`${ENDPOINT_URL}/shopping-lists/add-product`, { product, listId })
    .then(resp => resp.json())
    .then(json => dispatch(addProductSuccess(json, listId)))
    .catch(err => {
      dispatch(addProductFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, adding item failed..."
      );
    });
};
