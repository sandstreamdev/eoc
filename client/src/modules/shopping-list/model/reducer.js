import { combineReducers } from 'redux';

import { ShoppingListActionTypes } from './actionTypes';
import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';

const shoppingLists = (state = {}, action) => {
  switch (action.type) {
    case ShoppingListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
    case ShoppingListActionTypes.FETCH_META_DATA_SUCCESS:
      return { ...action.payload };
    case ShoppingListActionTypes.CREATE_LIST_SUCCESS:
      return {
        ...state,
        [action.payload._id]: { ...action.payload }
      };
    case ShoppingListActionTypes.DELETE_SUCCESS: {
      const { [action.payload]: removed, ...newState } = state;
      return newState;
    }
    case ShoppingListActionTypes.UPDATE_SUCCESS: {
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
    case ShoppingListActionTypes.ARCHIVE_SUCCESS: {
      const { listId: _id, isArchived } = action.payload;
      const archivedList = { _id, isArchived };
      return {
        ...state,
        [action.payload.listId]: archivedList
      };
    }
    case ShoppingListActionTypes.RESTORE_SUCCESS:
    case ShoppingListActionTypes.FETCH_DATA_SUCCESS: {
      return {
        ...state,
        [action.payload.listId]: action.payload.data
      };
    }
    case ProductActionTypes.ADD_PRODUCT_SUCCESS: {
      const updatedShoppingList = {
        ...state[action.payload.listId],
        products: [
          ...state[action.payload.listId].products,
          action.payload.product
        ]
      };
      return {
        ...state,
        [action.payload.listId]: updatedShoppingList
      };
    }
    case ProductActionTypes.TOGGLE_PRODUCT_SUCCESS: {
      const updatedShoppingList = {
        ...state[action.payload.listId],
        products: [...state[action.payload.listId].products].map(product =>
          product._id === action.payload.product._id
            ? {
                ...action.payload.product,
                isOrdered: action.payload.product.isOrdered
              }
            : product
        )
      };
      return {
        ...state,
        [action.payload.listId]: updatedShoppingList
      };
    }
    case ProductActionTypes.VOTE_FOR_PRODUCT_SUCCESS: {
      const updatedShoppingList = {
        ...state[action.payload.listId],
        products: [...state[action.payload.listId].products].map(product =>
          product._id === action.payload.product._id
            ? {
                ...action.payload.product,
                voterIds: action.payload.product.voterIds
              }
            : product
        )
      };
      return {
        ...state,
        [action.payload.listId]: updatedShoppingList
      };
    }
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case ProductActionTypes.ADD_PRODUCT_FAILURE:
    case ProductActionTypes.ADD_PRODUCT_SUCCESS:
    case ProductActionTypes.TOGGLE_PRODUCT_FAILURE:
    case ProductActionTypes.TOGGLE_PRODUCT_SUCCESS:
    case ProductActionTypes.VOTE_FOR_PRODUCT_FAILURE:
    case ProductActionTypes.VOTE_FOR_PRODUCT_SUCCESS:
    case ShoppingListActionTypes.ARCHIVE_FAILURE:
    case ShoppingListActionTypes.ARCHIVE_SUCCESS:
    case ShoppingListActionTypes.CREATE_LIST_FAILURE:
    case ShoppingListActionTypes.CREATE_LIST_SUCCESS:
    case ShoppingListActionTypes.DELETE_FAILURE:
    case ShoppingListActionTypes.DELETE_SUCCESS:
    case ShoppingListActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE:
    case ShoppingListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
    case ShoppingListActionTypes.FETCH_DATA_FAILURE:
    case ShoppingListActionTypes.FETCH_DATA_SUCCESS:
    case ShoppingListActionTypes.FETCH_META_DATA_FAILURE:
    case ShoppingListActionTypes.FETCH_META_DATA_SUCCESS:
    case ShoppingListActionTypes.RESTORE_FAILURE:
    case ShoppingListActionTypes.RESTORE_SUCCESS:
    case ShoppingListActionTypes.UPDATE_FAILURE:
    case ShoppingListActionTypes.UPDATE_SUCCESS:
      return false;
    case ProductActionTypes.ADD_PRODUCT_REQUEST:
    case ProductActionTypes.TOGGLE_PRODUCT_REQUEST:
    case ProductActionTypes.VOTE_FOR_PRODUCT_REQUEST:
    case ShoppingListActionTypes.ARCHIVE_REQUEST:
    case ShoppingListActionTypes.CREATE_LIST_REQUEST:
    case ShoppingListActionTypes.DELETE_REQUEST:
    case ShoppingListActionTypes.FETCH_ARCHIVED_META_DATA_REQUEST:
    case ShoppingListActionTypes.FETCH_DATA_REQUEST:
    case ShoppingListActionTypes.FETCH_META_DATA_REQUEST:
    case ShoppingListActionTypes.RESTORE_REQUEST:
    case ShoppingListActionTypes.UPDATE_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data: shoppingLists, isFetching });
