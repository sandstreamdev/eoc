import { ENDPOINT_URL } from '../common/variables';

// Action types
export const FETCH_ITEMS = 'FETCH_ITEMS';
export const FETCH_FAILED = 'FETCH_FAILED';

// Action creators
export const recieveItems = json => ({ type: FETCH_ITEMS, items: json });
export const fetchItemsError = err => ({ type: FETCH_FAILED, err });

// Dispatchers
export const fetchItems = () => dispatch =>
  fetch(`${ENDPOINT_URL}/items`, { credentials: 'same-origin' })
    .then(resp => resp.json())
    .then(json => {
      setTimeout(() => dispatch(recieveItems(json)), 1500);
    })
    .catch(err => setTimeout(() => dispatch(fetchItemsError(err)), 1500));
