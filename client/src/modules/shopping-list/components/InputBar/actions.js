import { ENDPOINT_URL } from 'common/constants/variables';
import { postData } from 'common/utils/fetchMethods';

// Action types
export const ADD_ITEM = 'ADD_ITEM';
export const ADD_ITEM_FAILURE = 'ADD_ITEM_FAILURE';
export const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';

// Action creators
export const addItemError = err => ({ type: ADD_ITEM_FAILURE, err });
export const addItemSuccess = item => ({ type: ADD_ITEM_SUCCESS, item });

// Dispatchers
export const addItem = item => dispatch =>
  postData(`${ENDPOINT_URL}/item/create`, JSON.stringify(item))
    .then(resp => resp.json())
    .then(json => dispatch(addItemSuccess(json)))
    .catch(err => {
      dispatch(addItemError(err));
      throw new Error('There was an error while adding new item.');
    });
