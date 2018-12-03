import { ADD_ITEM } from '../_actions/actionTypes';

export default function addItem(state = {}, action) {
  switch (action.type) {
    case ADD_ITEM:
      return Object.assign({}, state, {
        name: action.item.name,
        isOrdered: action.item.isOrdered
      });
    default:
      return state;
  }
}
