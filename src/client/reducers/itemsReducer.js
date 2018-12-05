import initialState from './initalState';
import { FETCH_ITEMS } from '../components/ProductsList/actions';

const items = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ITEMS:
      return Object.assign({}, state, {
        archiveList: action.items.filter(item => item.isOrdered),
        shoppingList: action.items.filter(item => !item.isOrdered).reverse()
      });
    default:
      return state;
  }
};

export default items;
