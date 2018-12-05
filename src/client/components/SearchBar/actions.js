// Action types
export const ADD_ITEM = 'ADD_ITEM';
export const ADD_ITEM_SUCCESS = 'ADD_ITEM_SUCCESS';

// Action creators
const addItemSuccess = item => ({ type: ADD_ITEM_SUCCESS, item });
const addItemToDb = item => ({ type: ADD_ITEM, item });

// Dispatchers
export const addItem = item => dispatch =>
  fetch('http://localhost:8080/item/create', {
    body: JSON.stringify(item),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(() => {
      dispatch(addItemToDb(item));
      dispatch(addItemSuccess(item));
    })
    .catch(err => console.error(err.message));
