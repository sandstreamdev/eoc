// Action types
export const ADD_ITEM = 'ADD_ITEM';

// Action creators
export function addItem(item) {
  return { type: ADD_ITEM, item };
}

// Dispatchers
export const dispatchNewItem = item => dispatch => {
  dispatch(addItem(item));
};
