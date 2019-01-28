import { items as itemsInitialState, initialStatus } from './initialState';
import { ShoppingListActionTypes } from '../enum';
import { ItemActionTypes } from 'modules/shopping-list/components/InputBar/enum';
import { StatusType } from 'common/constants/enums';

const items = (state = itemsInitialState, action) => {
  const { type } = action;
  switch (type) {
    case ItemActionTypes.ADD_ITEM_SUCCESS:
      return [...state, action.item];
    case ShoppingListActionTypes.FETCH_ITEMS:
      return action.items;
    case ItemActionTypes.TOGGLE_ITEM: {
      return state.map(item =>
        item._id === action.item._id
          ? { ...item, isOrdered: !item.isOrdered }
          : item
      );
    }
    case ItemActionTypes.VOTE_FOR_ITEM: {
      const { _id, votes } = action.item;
      return state.map(item => (item._id === _id ? { ...item, votes } : item));
    }
    default:
      return state;
  }
};

export const shoppingLists = (state = [], action) => {
  switch (action.type) {
    case ShoppingListActionTypes.FETCH_ALL_SHOPPING_LISTS_SUCCESS:
      return action.payload;
    case ShoppingListActionTypes.ADD_SHOPPING_LIST_SUCCESS:
      return [action.payload, ...state];
    default:
      return state;
  }
};

export const uiStatus = (state = initialStatus, action) => {
  switch (action.type) {
    case ShoppingListActionTypes.FETCH_FAILED:
      return {
        ...state,
        fetchStatus: StatusType.ERROR
      };
    case ShoppingListActionTypes.FETCH_ITEMS:
      return {
        ...state,
        fetchStatus: StatusType.RESOLVED
      };
    case ItemActionTypes.ADD_ITEM_FAILURE:
      return {
        ...state,
        newItemStatus: StatusType.ERROR
      };
    case ItemActionTypes.ADD_ITEM_SUCCESS:
      return {
        ...state,
        newItemStatus: StatusType.RESOLVED
      };
    default:
      return state;
  }
};

export default items;
