import { ENDPOINT_URL } from '../../common/variables';

// Action types
export const FETCH_ITEMS = 'FETCH_ITEMS';

// Action creators
export const recieveItems = json => ({ type: FETCH_ITEMS, items: json });

export const fetchItems = () => dispatch =>
  fetch(`${ENDPOINT_URL}/items`, { credentials: 'same-origin' })
    .then(resp => resp.json())
    .then(json => dispatch(recieveItems(json)))
    .catch(err => console.error(err.message));
