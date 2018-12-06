import initialState from './initalState';
import { FETCH_ITEMS } from '../components/ProductsList/actions';
import { ADD_ITEM_SUCCESS } from '../components/SearchBar/actions';

const items = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM_SUCCESS:
      return Object.assign({}, state, {
        shoppingList: state.shoppingList.concat([action.item]).reverse()
      });
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
