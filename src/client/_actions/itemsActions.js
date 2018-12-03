import { FETCH_ITEMS } from './actionTypes';
import { ENDPOINT_URL } from '../common/variables';

export const recieveItems = json => ({ type: FETCH_ITEMS, items: json });

export const fetchItems = () => dispatch =>
  fetch(`${ENDPOINT_URL}/items`, { credentials: 'same-origin' })
    .then(resp => resp.json())
    .then(json => dispatch(recieveItems(json)));
