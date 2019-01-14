import { items as itemsInitialState, initialStatus } from './initalState';
import { FETCH_FAILED, FETCH_ITEMS } from '../components/App/actions';
import { TOGGLE_ITEM, VOTE_FOR_ITEM } from '../components/ProductsList/actions';
import {
  ADD_ITEM_FAILURE,
  ADD_ITEM_SUCCESS
} from '../components/InputBar/actions';
import { StatusType } from '../common/enums';

const updateItem = (state, itemId, updatedProperties) =>
  state
    .map(item =>
      item._id === itemId ? { ...item, ...updatedProperties } : item
    )
    .reverse();

const items = (state = itemsInitialState, action) => {
  const { type } = action;
  switch (type) {
    case ADD_ITEM_SUCCESS:
      return [...state, action.item];
    case FETCH_ITEMS:
      return action.items;
    case TOGGLE_ITEM: {
      const { _id, isOrdered, author, votes } = action.item;
      return updateItem(state, _id, { isOrdered, author, votes });
    }
    case VOTE_FOR_ITEM: {
      const { _id, votes } = action.item;
      return updateItem(state, _id, { votes });
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
