import { ENDPOINT_URL } from 'common/constants/variables';
import { postData } from 'common/utils/fetchMethods';
import { ProductActionTypes } from './actionTypes';

// Action creators
export const addProductFailure = err => ({
  type: ProductActionTypes.ADD_PRODUCT_FAILURE,
  err
});
export const addProductSuccess = product => ({
  type: ProductActionTypes.ADD_PRODUCT_SUCCESS,
  product
});

// Dispatchers
export const addProduct = product => dispatch =>
  postData(`${ENDPOINT_URL}/item/create`, product)
    .then(resp => resp.json())
    .then(json => dispatch(addProductSuccess(json)))
    .catch(err => {
      dispatch(addProductFailure(err));
      throw new Error('There was an error while adding new product.');
    });
