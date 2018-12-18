import { items as itemsInitialState, status } from './initalState';
import { FETCH_FAILED, FETCH_ITEMS } from '../App/actions';
import { TOGGLE_ITEM } from '../components/ProductsList/actions';
import {
  ADD_ITEM_FAILURE,
  ADD_ITEM_SUCCESS
} from '../components/InputBar/actions';
import { statusType } from '../common/enums';

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

/**
 * Use string instead of booleans to indicate status of fetching
 * items or adding a new item status. Eg. For pending state: "true",
 * for resolved state: "false", for error: "error".
 */
const uiStatus = (state = status, action) => {
  switch (action.type) {
    case FETCH_FAILED:
      return Object.assign({}, state, {
        fetchStatus: statusType.ERROR
      });
    case FETCH_ITEMS:
      return Object.assign({}, state, {
        fetchStatus: statusType.RESOLVED
      });
    case ADD_ITEM_FAILURE:
      return Object.assign({}, state, {
        newItemStatus: statusType.ERROR
      });
    case ADD_ITEM_SUCCESS:
      return Object.assign({}, state, {
        newItemStatus: statusType.RESOLVED
      });
    default:
      return state;
  }
};

export default items;
export { uiStatus };
