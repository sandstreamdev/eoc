import { ENDPOINT_URL } from 'common/constants/variables';
import { postData } from 'common/utils/fetchMethods';
import { ItemActionTypes } from '../enum';

// Action creators
export const addItemFailure = err => ({
  type: ItemActionTypes.ADD_ITEM_FAILURE,
  err
});
export const addItemSuccess = item => ({
  type: ItemActionTypes.ADD_ITEM_SUCCESS,
  item
});

// Dispatchers
export const addItem = item => dispatch =>
  postData(`${ENDPOINT_URL}/item/create`, JSON.stringify(item))
    .then(resp => resp.json())
    .then(json => dispatch(addItemSuccess(json)))
    .catch(err => {
      dispatch(addItemFailure(err));
      throw new Error('There was an error while adding new item.');
    });
