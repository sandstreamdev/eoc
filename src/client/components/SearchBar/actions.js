// Action types
export const ADD_ITEM = 'ADD_ITEM';

// Action creators
const addItemSuccess = item => ({ type: ADD_ITEM, item });

// Dispatchers
export const addItem = item => dispatch =>
  fetch('http://localhost:8080/item/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  })
    .then(resp => {
      dispatch(addItemSuccess(item));
    })
    .catch(err => console.error(err.message));
