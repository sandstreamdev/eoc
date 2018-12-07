import { ENDPOINT_URL } from '../../common/variables';

// Action types
export const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';
export const ADD_ITEM = 'ADD_ITEM';

// Action creators
const addItemSuccess = item => ({ type: ADD_ITEM_SUCCESS, item });

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
    .then(json => dispatch(addItemSuccess(json)));
// Error handler in SearchBar component
