import initialState from './initalState';
import { FETCH_ITEMS } from '../components/ProductsList/actions';

const items = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ITEMS:
      return Object.assign({}, state, {
        shoppingList: action.items.filter(item => !item.isOrdered),
        archiveList: action.items.filter(item => item.isOrdered)
      });
    default:
      return state;
  }
};

export default items;
