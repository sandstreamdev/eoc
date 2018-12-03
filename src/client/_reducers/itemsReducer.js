import initialState from './initalState';
import { FETCH_ITEMS } from '../_actions/actionTypes';

export default function items(state = initialState, action) {
  if (action.type === 'undefined') return state;

  switch (action.type) {
    case FETCH_ITEMS:
      return Object.assign({}, state, {
        shoppingList: action.items.filter(item => !item.isOrdered),
        archiveList: action.items.filter(item => item.isOrdered)
      });
    default:
      return state;
  }
}
