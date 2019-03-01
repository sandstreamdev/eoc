import { ItemActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';
import { ListActionTypes } from './actionTypes';
import lists from './reducer';
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
      lists(storeProducts, {
        type: ListActionTypes.FETCH_DATA_SUCCESS,
        payload: { products: [newProduct], listId: '1234' }
      })
    ).toEqual(shoppingListMockPopulated);
  });

  it('adds new product data', () => {
    expect(
      lists(storeProducts, {
        type: ItemActionTypes.ADD_ITEM_SUCCESS,
        payload: { product: newProduct, listId: '1234' }
      })
    ).toEqual(shoppingListMockPopulated);
  });

  it('tooggles product is ordered', () => {
    expect(
      lists(shoppingListMockPopulated, {
        type: ItemActionTypes.TOGGLE_ITEM_SUCCESS,
        payload: {
          product: { ...newProduct, isOrdered: !newProduct.isOrdered },
          listId: '1234'
        }
      })
    ).toEqual(shoppingListMockProductToggled);
  });

  it('saves voters id upon voting', () => {
    expect(
      lists(shoppingListMockPopulated, {
        type: ItemActionTypes.VOTE_FOR_ITEM,
        payload: { ...newProduct, voterIds: ['abcd', 'efgh', 'ijkl'] }
      })
    ).toEqual(shoppingListMockProductVoted);
  });

  it('removes voters id after the vote for the second time', () => {
    expect(
      lists(shoppingListMockProductVoted, {
        type: ItemActionTypes.VOTE_FOR_ITEM,
        payload: { ...newProduct, voterIds: ['abcd', 'efgh'] }
      })
    ).toEqual(shoppingListMockPopulated);
  });
});
