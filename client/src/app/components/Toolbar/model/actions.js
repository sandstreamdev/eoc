import { ENDPOINT_URL } from 'common/constants/variables';

const ADD_SHOPPING_LIST_SUCCESS = 'ADD_NEW_SHOPPING_LIST';
const ADD_SHOPPING_LIST_FAILURE = 'ADD_SHOPPING_LIST_FAIULRE';

const newShoppingListSuccess = data => ({
  type: ADD_SHOPPING_LIST_SUCCESS,
  payload: data
});

const newShoppingListFailure = () => ({
  type: ADD_SHOPPING_LIST_FAILURE
});

export const setNewShoppingList = (name, description) => dispatch => {
  fetch(`${ENDPOINT_URL}/shopping-lists/create`, {
    body: JSON.stringify({ name, description }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
    .then(resp => resp.json())
    .then(json => dispatch(newShoppingListSuccess(json)))
    .catch(() => dispatch(newShoppingListFailure()));
};
