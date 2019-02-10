import { combineReducers } from 'redux';

import { ShoppingListActionTypes } from './actionTypes';
import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';

export const products = (state = [], action) => {
  const { type } = action;
  switch (type) {
    case ProductActionTypes.ADD_PRODUCT_SUCCESS:
      return [...state, action.product];
    case ShoppingListActionTypes.FETCH_PRODUCTS_SUCCESS:
      return action.products;
    case ProductActionTypes.TOGGLE_PRODUCT_SUCCESS: {
      return state.map(product =>
        product._id === action.product._id
          ? { ...product, isOrdered: !product.isOrdered }
          : product
      );
    }
    case ProductActionTypes.VOTE_FOR_PRODUCT_SUCCESS: {
      const { _id, voterIds } = action.product;
      return state.map(product =>
        product._id === _id ? { ...product, voterIds } : product
      );
    }
    default:
      return state;
  }
};

const data = (state = [], action) => {
  switch (action.type) {
    case ShoppingListActionTypes.FETCH_SHOPPING_LISTS_SUCCESS:
      return action.payload;
    case ShoppingListActionTypes.CREATE_SHOPPING_LIST_SUCCESS:
      return [action.payload, ...state];
    case ShoppingListActionTypes.DELETE_SHOPPING_LIST_SUCCESS: {
      return state.filter(list => list._id !== action.id);
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
    case ShoppingListActionTypes.CREATE_SHOPPING_LIST_FAILURE:
    case ShoppingListActionTypes.CREATE_SHOPPING_LIST_SUCCESS:
    case ShoppingListActionTypes.DELETE_SHOPPING_LIST_FAILURE:
    case ShoppingListActionTypes.DELETE_SHOPPING_LIST_SUCCESS:
    case ShoppingListActionTypes.FETCH_PRODUCTS_FAILURE:
    case ShoppingListActionTypes.FETCH_PRODUCTS_SUCCESS:
    case ShoppingListActionTypes.FETCH_SHOPPING_LISTS_FAILURE:
    case ShoppingListActionTypes.FETCH_SHOPPING_LISTS_SUCCESS:
      return false;
    case ProductActionTypes.ADD_PRODUCT_REQUEST:
    case ProductActionTypes.TOGGLE_PRODUCT_REQUEST:
    case ProductActionTypes.VOTE_FOR_PRODUCT_REQUEST:
    case ShoppingListActionTypes.CREATE_SHOPPING_LIST_REQUEST:
    case ShoppingListActionTypes.DELETE_SHOPPING_LIST_REQUEST:
    case ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST:
    case ShoppingListActionTypes.FETCH_SHOPPING_LISTS_REQUEST:
      return true;
    default:
      return state;
  }
};

export default combineReducers({ data, isFetching, products });
