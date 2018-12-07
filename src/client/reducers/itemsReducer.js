import { items as itemsInitialState } from './initalState';
import { FETCH_ITEMS } from '../App/actions';
import { TOGGLE_ITEM } from '../components/ProductsList/actions';
import { ADD_ITEM_SUCCESS } from '../components/SearchBar/actions';

const items = (state = itemsInitialState, action) => {
  switch (action.type) {
    case ADD_ITEM_SUCCESS:
      return state.concat([action.item]);
    case FETCH_ITEMS:
      return action.items;
    case TOGGLE_ITEM: {
      const index = state.findIndex(item => item._id === action.item._id);
      return state
        .slice(0, index)
        .concat(state.slice(index + 1))
        .concat([action.item]);
    }
    default:
      return state;
  }
};

export default items;
