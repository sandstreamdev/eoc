import { ENDPOINT_URL } from 'common/constants/variables';
import { postData } from 'common/utils/fetchMethods';
import { ProductActionTypes } from './actionTypes';

// Action creators
export const addProductFailure = err => ({
  type: ProductActionTypes.ADD_PRODUCT_FAILURE,
  err
});
export const addProductSuccess = (product, listId) => ({
  type: ProductActionTypes.ADD_PRODUCT_SUCCESS,
  payload: { product, listId }
});

// Dispatchers
export const addProductToList = (product, listId) => dispatch =>
  postData(`${ENDPOINT_URL}/shopping-lists/add-product`, { product, listId })
    .then(resp => resp.json())
    .then(json => {
      console.log(json);
      dispatch(addProductSuccess(json, listId));
    })
    .catch(err => {
      dispatch(addProductFailure(err));
      throw new Error('There was an error while adding new product.');
    });
