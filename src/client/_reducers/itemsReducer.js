import initialState from './initalState';
import { FETCH_ITEMS } from '../_actions/actionTypes';

export default function items(state = initialState, action) {
  if (action.type === 'undefined') return state;

  switch (action.type) {
    case FETCH_ITEMS:
      return action.items;
    default:
      return state;
  }
}

console.log('Reducing items: /_REDUCERS/itemsReducer.js');
