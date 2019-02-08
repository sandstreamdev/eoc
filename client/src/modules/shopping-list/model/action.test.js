import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';

import { ENDPOINT_URL } from 'common/constants/variables';
import { fetchProducts } from './actions';
import { productsMock } from '__mocks__/productsMock';
import { ShoppingListActionTypes } from './actionTypes';
import { NotificationActionTypes } from 'modules/notification/model/actionsTypes';

const getMockStore = configureMockStore([thunk]);

describe('fetchProducts action creator', () => {
  it('dispatches the correct actions on fetch succeeded', () => {
    fetch.mockResponseOnce(JSON.stringify(productsMock));
    const store = getMockStore({ data: [], products: [], isFetching: false });
    const expectedActions = [
      {
        type: ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST
      },
      {
        type: ShoppingListActionTypes.FETCH_PRODUCTS_SUCCESS,
        products: productsMock
      }
    ];

    store.dispatch(fetchProducts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${ENDPOINT_URL}/items`);
    fetch.resetMocks();
  });

  it('dispatches the correct actions on fetch failed', () => {
    fetch.mockRejectOnce();
    const store = getMockStore({ data: [], products: [], isFetching: false });
    const expectedActions = [
      {
        type: ShoppingListActionTypes.FETCH_PRODUCTS_REQUEST
      },
      {
        type: ShoppingListActionTypes.FETCH_PRODUCTS_FAILURE,
        errMessage: undefined
      },
      {
        type: NotificationActionTypes.ADD_NOTIFICATION,
        notification: {
          id: 'notification_1',
          message: "Oops, we're sorry, fetching products failed...",
          type: 'error'
        }
      }
    ];
    store.dispatch(fetchProducts()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual(`${ENDPOINT_URL}/items`);
    fetch.resetMocks();
  });
});
