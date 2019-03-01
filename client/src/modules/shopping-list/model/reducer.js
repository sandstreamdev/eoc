import { combineReducers } from 'redux';

import { ListActionTypes } from './actionTypes';
import { ItemActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';

const items = (state, action) => {
  switch (action.type) {
    case ItemActionTypes.ADD_ITEM_SUCCESS:
      return {
        ...state,
        products: [...state.products, action.payload.product]
      };
    case ItemActionTypes.TOGGLE_ITEM_SUCCESS:
      return {
        ...state,
        products: [...state.products].map(product =>
          product._id === action.payload.product._id
            ? {
                ...action.payload.product,
                isOrdered: action.payload.product.isOrdered
              }
            : product
        )
      };
    case ItemActionTypes.VOTE_FOR_ITEM_SUCCESS:
      return {
        ...state,
        products: [...state.products].map(product =>
          product._id === action.payload.product._id
            ? {
                ...action.payload.product,
                voterIds: action.payload.product.voterIds
              }
            : product
        )
      };
    default:
      return state;
  }
};

const lists = (state = {}, action) => {
  switch (action.type) {
    case ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
    case ListActionTypes.FETCH_META_DATA_SUCCESS:
      return { ...action.payload };
    case ListActionTypes.CREATE_LIST_SUCCESS:
      return {
        ...state,
        [action.payload._id]: { ...action.payload }
      };
    case ListActionTypes.DELETE_SUCCESS: {
      const { [action.payload]: removed, ...newState } = state;
      return newState;
    }
    case ListActionTypes.UPDATE_SUCCESS: {
      const prevList = state[action.payload.listId];
      const updatedList = {
        ...prevList,
        name: action.payload.name || prevList.name,
        description: action.payload.description || prevList.description
      };
      return {
        ...state,
        [action.payload.listId]: updatedList
      };
    }
    case ListActionTypes.ARCHIVE_SUCCESS: {
      const { listId: _id, isArchived } = action.payload;
      const archivedList = { _id, isArchived };
      return {
        ...state,
        [action.payload.listId]: archivedList
      };
    }
    case ListActionTypes.RESTORE_SUCCESS:
    case ListActionTypes.FETCH_DATA_SUCCESS: {
      return {
        ...state,
        [action.payload.listId]: action.payload.data
      };
    }
    case ItemActionTypes.ADD_ITEM_SUCCESS: {
      return {
        ...state,
        [action.payload.listId]: items(state[action.payload.listId], action)
      };
    }
    case ItemActionTypes.TOGGLE_ITEM_SUCCESS: {
      return {
        ...state,
        [action.payload.listId]: items(state[action.payload.listId], action)
      };
    }
    case ItemActionTypes.VOTE_FOR_ITEM_SUCCESS: {
      return {
        ...state,
        [action.payload.listId]: items(state[action.payload.listId], action)
      };
    }
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case ItemActionTypes.ADD_ITEM_FAILURE:
    case ItemActionTypes.ADD_ITEM_SUCCESS:
    case ItemActionTypes.TOGGLE_ITEM_FAILURE:
    case ItemActionTypes.TOGGLE_ITEM_SUCCESS:
    case ItemActionTypes.VOTE_FOR_ITEM_FAILURE:
    case ItemActionTypes.VOTE_FOR_ITEM_SUCCESS:
    case ListActionTypes.ARCHIVE_FAILURE:
    case ListActionTypes.ARCHIVE_SUCCESS:
    case ListActionTypes.CREATE_LIST_FAILURE:
    case ListActionTypes.CREATE_LIST_SUCCESS:
    case ListActionTypes.DELETE_FAILURE:
    case ListActionTypes.DELETE_SUCCESS:
    case ListActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE:
    case ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
    case ListActionTypes.FETCH_DATA_FAILURE:
    case ListActionTypes.FETCH_DATA_SUCCESS:
    case ListActionTypes.FETCH_META_DATA_FAILURE:
    case ListActionTypes.FETCH_META_DATA_SUCCESS:
    case ListActionTypes.RESTORE_FAILURE:
    case ListActionTypes.RESTORE_SUCCESS:
    case ListActionTypes.UPDATE_FAILURE:
    case ListActionTypes.UPDATE_SUCCESS:
      return false;
    case ItemActionTypes.ADD_ITEM_REQUEST:
    case ItemActionTypes.TOGGLE_ITEM_REQUEST:
    case ItemActionTypes.VOTE_FOR_ITEM_REQUEST:
    case ListActionTypes.ARCHIVE_REQUEST:
    case ListActionTypes.CREATE_LIST_REQUEST:
    case ListActionTypes.DELETE_REQUEST:
    case ListActionTypes.FETCH_ARCHIVED_META_DATA_REQUEST:
    case ListActionTypes.FETCH_DATA_REQUEST:
    case ListActionTypes.FETCH_META_DATA_REQUEST:
    case ListActionTypes.RESTORE_REQUEST:
    case ListActionTypes.UPDATE_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: lists, isFetching });
