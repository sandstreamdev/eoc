import { items as itemsInitialState, status } from './initalState';
import { FETCH_ITEMS, FETCH_FAILED } from '../App/actions';
import { TOGGLE_ITEM } from '../components/ProductsList/actions';
import {
  ADD_ITEM_SUCCESS,
  ADD_ITEM_ERROR
} from '../components/SearchBar/actions';

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

const uiStatus = (state = status, action) => {
  switch (action.type) {
    case FETCH_FAILED:
      return Object.assign({}, state, {
        fetchStatus: 'error'
      });
    case FETCH_ITEMS:
      return Object.assign({}, state, {
        fetchStatus: 'false'
      });
    case ADD_ITEM_SUCCESS:
      return Object.assign({}, state, {
        newItemStatus: 'false'
      });
    case ADD_ITEM_ERROR:
      return Object.assign({}, state, {
        newItemStatus: 'error'
      });
    default:
      return state;
  }
};

export default items;
export { uiStatus };
