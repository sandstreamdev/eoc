// import thunk from 'redux-thunk';
// import configureMockStore from 'redux-mock-store';

// import { ENDPOINT_URL } from 'common/constants/variables';
// import { fetchListData } from './actions';
// import {
//   itemsMock,
//   newItemMock,
//   listMockNotPopulated
// } from '__mocks__/itemsMock';
// import { ListActionTypes } from './actionTypes';
// import { NotificationActionTypes } from 'modules/notification/model/actionsTypes';

// const getMockStore = configureMockStore([thunk]);

// describe('fetchItems action creator', () => {
//   it('dispatches the correct actions on fetch succeeded', () => {
//     fetch.mockResponseOnce(JSON.stringify(itemsMock));
//     const store = getMockStore(listMockNotPopulated);
//     const expectedActions = [
//       {
//         type: ListActionTypes.FETCH_ITEMS_SUCCESS,
//         payload: { items: [newItemMock], listId: '1234' }
//       }
//     ];

//     store.dispatch(fetchListData()).then(() => {
//       expect(store.getActions()).toEqual(expectedActions);
//     });
//     expect(fetch.mock.calls.length).toEqual(1);
//     expect(fetch.mock.calls[0][0]).toEqual(
//       `${ENDPOINT_URL}/lists/1234/get-items`
//     );
//     fetch.resetMocks();
//   });

//   it('dispatches the correct actions on fetch failed', () => {
//     fetch.mockRejectOnce();
//     const store = getMockStore({ data: [], items: [], isFetching: false });
//     const expectedActions = [
//       {
//         type: ListActionTypes.FETCH_DATA_FAILURE,
//         payload: undefined
//       },
//       {
//         type: NotificationActionTypes.ADD,
//         payload: {
//           id: 'notification_1',
//           message: "Oops, we're sorry, fetching items failed...",
//           type: 'error'
//         }
//       }
//     ];
//     store.dispatch(fetchListData()).then(() => {
//       expect(store.getActions()).toEqual(expectedActions);
//     });
//     expect(fetch.mock.calls.length).toEqual(1);
//     expect(fetch.mock.calls[0][0]).toEqual(`${ENDPOINT_URL}/items`);
//     fetch.resetMocks();
//   });
// });

test('skip', () => {});
