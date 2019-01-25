import { ENDPOINT_URL } from 'common/constants/variables';

export const ADD_SHOPPING_LIST_SUCCESS = 'ADD_NEW_SHOPPING_LIST';

const newShoppingListSuccess = data => ({
  type: ADD_SHOPPING_LIST_SUCCESS,
  payload: data
});

export const setNewShoppingList = (name, description) => dispatch =>
  fetch(`${ENDPOINT_URL}/shopping-lists/new-list`, {
    body: JSON.stringify({ name, description }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(resp => resp.json())
    .then(json => dispatch(newShoppingListSuccess(json)))
    .catch(err => console.error(err));
