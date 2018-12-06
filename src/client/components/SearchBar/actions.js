// Action types
export const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';
export const ADD_ITEM = 'ADD_ITEM';

// Action creators
const addItemSuccess = item => ({ type: ADD_ITEM_SUCCESS, item });

// Dispatchers
export const addItem = item => dispatch =>
  fetch('http://localhost:8080/item/create', {
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(resp => {
      dispatch(addItemSuccess(item));
      return resp.json();
    })
    .then(json => console.log(json))
    .catch(err => console.error(err.message));
