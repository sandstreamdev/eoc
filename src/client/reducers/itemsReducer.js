import { items as itemsInitialState, initialStatus } from './initalState';
import { FETCH_FAILED, FETCH_ITEMS } from '../App/actions';
import { TOGGLE_ITEM } from '../components/ProductsList/actions';
import {
  ADD_ITEM_FAILURE,
  ADD_ITEM_SUCCESS
} from '../components/InputBar/actions';
import { StatusType } from '../common/enums';

const items = (state = itemsInitialState, action) => {
  const { type } = action;
  switch (type) {
    case ADD_ITEM_SUCCESS:
      return [...state, action.item];
    case FETCH_ITEMS:
      return action.items;
    case TOGGLE_ITEM: {
      return state.map(item =>
        item._id === action.item._id
          ? { ...item, isOrdered: !item.isOrdered }
          : item
      );
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
const uiStatus = (state = initialStatus, action) => {
  switch (action.type) {
    case FETCH_FAILED:
      return {
        ...state,
        fetchStatus: StatusType.ERROR
      };
    case FETCH_ITEMS:
      return {
        ...state,
        fetchStatus: StatusType.RESOLVED
      };
    case ADD_ITEM_FAILURE:
      return {
        ...state,
        newItemStatus: StatusType.ERROR
      };
    case ADD_ITEM_SUCCESS:
      return {
        ...state,
        newItemStatus: StatusType.RESOLVED
      };
    default:
      return state;
  }
};

export default items;
export { uiStatus };
