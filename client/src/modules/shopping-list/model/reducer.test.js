import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';
import { ShoppingListActionTypes } from './actionTypes';
import products from './reducer';
import { products as productsInitialState } from './initialState';

describe('Products reducer', () => {
  let productsCollection;
  let newProduct;

  beforeEach(() => {
    productsCollection = [
      {
        id: '5678',
        name: 'Coffe',
        authorName: 'John Smith',
        isOrdered: false,
        votes: ['abcd', 'efgh']
      },
      {
        id: '9876',
        name: 'Tea',
        authorName: 'Joan Smith',
        isOrdered: true,
        votes: []
      }
    ];
    newProduct = {
      id: '1234',
      name: 'Sugar',
      authorName: 'Marry Smith',
      isOrdered: false,
      votes: ['abcd', 'efgh']
    };
  });

  it('stores products data upon fetch', () => {
    expect(
      products(productsInitialState, {
        type: ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST,
        products: productsCollection
      })
    ).toEqual(productsCollection);
  });

  it('adds new product data', () => {
    expect(
      products(productsCollection, {
        type: ProductActionTypes.ADD_PRODUCT_SUCCESS,
        product: newProduct
      })
    ).toEqual([...productsCollection, newProduct]);
  });

  it('tooggles product is ordered', () => {
    expect(
      products([newProduct], {
        type: ProductActionTypes.TOGGLE_PRODUCT,
        product: [newProduct]
      })
    ).toEqual([{ ...newProduct, isOrdered: !newProduct.isOrdered }]);
  });

  it('saves voters id upon voting', () => {
    expect(
      products([newProduct], {
        type: ProductActionTypes.VOTE_FOR_PRODUCT,
        product: { id: '1234', votes: ['abcd', 'efgh', 'ijkl'] }
      })
    ).toEqual([{ ...newProduct, votes: ['abcd', 'efgh', 'ijkl'] }]);
  });

  it('removes voters id after the vote for the seconf time', () => {
    expect(
      products([newProduct], {
        type: ProductActionTypes.VOTE_FOR_PRODUCT,
        product: { id: '1234', votes: ['abcd'] }
      })
    ).toEqual([{ ...newProduct, votes: ['abcd'] }]);
  });
});
