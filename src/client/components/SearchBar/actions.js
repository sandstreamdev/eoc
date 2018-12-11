import { ENDPOINT_URL } from '../../common/variables';

// Action types
export const ADD_ITEM_ERROR = 'ADD_ITEM_ERROR';
export const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';
export const ADD_ITEM = 'ADD_ITEM';

// Action creators
const addItemSuccess = item => ({ type: ADD_ITEM_SUCCESS, item });
const addItemError = err => ({ type: ADD_ITEM_ERROR, err });

// Dispatchers
export const addItem = item => dispatch =>
  fetch(`${ENDPOINT_URL}/item/create`, {
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(resp => resp.json())
    .then(json => dispatch(addItemSuccess(json)))
    .catch(err => {
      dispatch(addItemError(err));
      console.error(err);
    });
