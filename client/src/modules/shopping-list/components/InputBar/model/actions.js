import { ENDPOINT_URL } from 'common/constants/variables';
import { postData } from 'common/utils/fetchMethods';
import { ProductActionTypes } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

// Action creators
const addProductFailure = errorMessage => ({
  type: ProductActionTypes.ADD_PRODUCT_FAILURE,
  errorMessage
});
const addProductSuccess = product => ({
  type: ProductActionTypes.ADD_PRODUCT_SUCCESS,
  product
});
const addProductRequest = () => ({
  type: ProductActionTypes.ADD_PRODUCT_REQUEST
});

// Dispatchers
export const addProduct = product => dispatch => {
  dispatch(addProductRequest());
  postData(`${ENDPOINT_URL}/item/create`, product)
    .then(resp => resp.json())
    .then(json => dispatch(addProductSuccess(json)))
    .catch(err => {
      dispatch(addProductFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, adding item failed..."
      );
    });
};
