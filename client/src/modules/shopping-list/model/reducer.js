import {
  products as productsInitialState,
  initialStatus
} from './initialState';
import { ShoppingListActionTypes } from './actionTypes';
import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';
import { StatusType } from 'common/constants/enums';

const products = (state = productsInitialState, action) => {
  const { type } = action;
  switch (type) {
    // case ProductActionTypes.ADD_PRODUCT_SUCCESS:
    //   return [...state, action.product];
    case ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST:
      console.log(action);
      return action.payload.products;
    case ProductActionTypes.TOGGLE_PRODUCT: {
      return state.map(product =>
        product._id === action.product._id
          ? { ...product, isOrdered: !product.isOrdered }
          : product
      );
    }
    case ProductActionTypes.VOTE_FOR_PRODUCT: {
      const { _id, voterIds } = action.product;
      return state.map(product =>
        product._id === _id ? { ...product, voterIds } : product
      );
    }
    default:
      return state;
  }
};

export const shoppingLists = (state = [], action) => {
  switch (action.type) {
    case ShoppingListActionTypes.FETCH_SHOPPING_LISTS_META_DATA_SUCCESS:
      return [...action.payload];
    case ShoppingListActionTypes.ADD_SHOPPING_LIST_SUCCESS:
      return [action.payload, ...state];
    case ProductActionTypes.ADD_PRODUCT_SUCCESS:
      console.log(state);
      return [...state];
    default:
      return state;
  }
};

export const uiStatus = (state = initialStatus, action) => {
  switch (action.type) {
    case ShoppingListActionTypes.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        fetchStatus: StatusType.ERROR
      };
    case ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        fetchStatus: StatusType.RESOLVED
      };
    case ProductActionTypes.ADD_PRODUCT_FAILURE:
      return {
        ...state,
        newProductStatus: StatusType.ERROR
      };
    case ProductActionTypes.ADD_PRODUCT_SUCCESS:
      return {
        ...state,
        newProductStatus: StatusType.RESOLVED
      };
    default:
      return state;
  }
};

export default products;
