import { FETCH_ITEMS } from './actionTypes';

// Action creator
export function recieveItems(json) {
  console.log('Items actions /_ACTIONS/itemsActions.js: recieveItems');
  return { type: FETCH_ITEMS, items: json };
}

export function fetchItems() {
  console.log('Items actions /_ACTIONS/itemsActions.js: FetchItems');
  return dispatch =>
    fetch('http://localhost:8080/items')
      .then(resp => resp.json())
      .then(json => dispatch(recieveItems(json)));
}
