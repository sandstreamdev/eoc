import { items as itemsInitialState, initialStatus } from './initialState';
import { FETCH_FAILED, FETCH_ITEMS } from 'modules/shopping-list/model/actions';
import {
  TOGGLE_ITEM,
  VOTE_FOR_ITEM
} from 'modules/shopping-list/components/ProductsList/actions';
import {
  ADD_ITEM_FAILURE,
  ADD_ITEM_SUCCESS
} from 'modules/shopping-list/components/InputBar/actions';
import { StatusType } from 'common/constants/enums';

const items = (state = itemsInitialState, action) => {
  const { type } = action;
  switch (type) {
    case ADD_ITEM_SUCCESS:
      return [action.item, ...state];
    case FETCH_ITEMS:
      return action.items;
    case TOGGLE_ITEM: {
      return state.map(item =>
        item._id === action.item._id
          ? { ...item, isOrdered: !item.isOrdered }
          : item
      );
    }
    case VOTE_FOR_ITEM: {
      const { _id, votes } = action.item;
      return state.map(item => (item._id === _id ? { ...item, votes } : item));
    }
    default:
      return state;
  }
};

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
