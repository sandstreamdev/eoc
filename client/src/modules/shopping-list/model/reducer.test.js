import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';
import { ShoppingListActionTypes } from './actionTypes';
import shoppingLists from './reducer';
import {
  newProductMock,
  shoppingListMockNotPopulated,
  shoppingListMockPopulated,
  shoppingListMockProductToggled,
  shoppingListMockProductVoted
} from '__mocks__/productsMock';

describe('Products reducer', () => {
  let storeProducts = {
    isFetching: false,
    data: []
  };
  let newProduct;

  beforeEach(() => {
    storeProducts = shoppingListMockNotPopulated;
    newProduct = { ...newProductMock };
  });

  it('stores products data upon fetch', () => {
    expect(
      shoppingLists(storeProducts, {
        type: ShoppingListActionTypes.FETCH_PRODUCTS_SUCCESS,
        payload: { products: [newProduct], listId: '1234' }
      })
    ).toEqual(shoppingListMockPopulated);
  });

  it('adds new product data', () => {
    expect(
      shoppingLists(storeProducts, {
        type: ProductActionTypes.ADD_PRODUCT_SUCCESS,
        payload: { product: newProduct, listId: '1234' }
      })
    ).toEqual(shoppingListMockPopulated);
  });

  it('tooggles product is ordered', () => {
    expect(
      shoppingLists(shoppingListMockPopulated, {
        type: ProductActionTypes.TOGGLE_PRODUCT,
        payload: {
          product: { ...newProduct, isOrdered: !newProduct.isOrdered },
          listId: '1234'
        }
      })
    ).toEqual(shoppingListMockProductToggled);
  });

  it('saves voters id upon voting', () => {
    expect(
      shoppingLists(shoppingListMockPopulated, {
        type: ProductActionTypes.VOTE_FOR_PRODUCT,
        payload: { ...newProduct, voterIds: ['abcd', 'efgh', 'ijkl'] }
      })
    ).toEqual(shoppingListMockProductVoted);
  });

  it('removes voters id after the vote for the second time', () => {
    expect(
      shoppingLists(shoppingListMockProductVoted, {
        type: ProductActionTypes.VOTE_FOR_PRODUCT,
        payload: { ...newProduct, voterIds: ['abcd', 'efgh'] }
      })
    ).toEqual(shoppingListMockPopulated);
  });
});
