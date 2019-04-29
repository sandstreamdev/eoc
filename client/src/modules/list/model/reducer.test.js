import { ItemActionTypes } from 'modules/list/components/Items/model/actionTypes';
import { ListActionTypes } from './actionTypes';
import lists from './reducer';
import {
  newItemMock,
  listMockNotPopulated,
  listMockPopulated,
  listMockItemToggled,
  listMockItemVoted
} from '__mocks__/itemsMock';

describe('Items reducer', () => {
  let storeItems = {
    isFetching: false,
    data: []
  };
  let newItem;

  beforeEach(() => {
    storeItems = listMockNotPopulated;
    newItem = { ...newItemMock };
  });

  it('stores items data upon fetch', () => {
    expect(
      lists(storeItems, {
        type: ListActionTypes.FETCH_DATA_SUCCESS,
        payload: { items: [newItem], listId: '1234' }
      })
    ).toEqual(listMockPopulated);
  });

  it('adds new item data', () => {
    expect(
      lists(storeItems, {
        type: ItemActionTypes.ADD_SUCCESS,
        payload: { item: newItem, listId: '1234' }
      })
    ).toEqual(listMockPopulated);
  });

  it('tooggles item is ordered', () => {
    expect(
      lists(listMockPopulated, {
        type: ItemActionTypes.TOGGLE_SUCCESS,
        payload: {
          item: { ...newItem, isOrdered: !newItem.isOrdered },
          listId: '1234'
        }
      })
    ).toEqual(listMockItemToggled);
  });

  it('saves voters id upon voting', () => {
    expect(
      lists(listMockPopulated, {
        type: ItemActionTypes.VOTE_SUCCESS,
        payload: { ...newItem, voterIds: ['abcd', 'efgh', 'ijkl'] }
      })
    ).toEqual(listMockItemVoted);
  });

  it('removes voters id after the vote for the second time', () => {
    expect(
      lists(listMockItemVoted, {
        type: ItemActionTypes.VOTE_SUCCESS,
        payload: { ...newItem, voterIds: ['abcd', 'efgh'] }
      })
    ).toEqual(listMockPopulated);
  });
});
