import { combineReducers } from 'redux';
import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { ListActionTypes } from './actionTypes';
import { ItemActionTypes } from 'modules/list/components/InputBar/model/actionTypes';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';

const items = (state, action) => {
  switch (action.type) {
    case ItemActionTypes.ADD_SUCCESS:
      return { ...state, items: [action.payload.item, ...state.items] };
    case ItemActionTypes.TOGGLE_SUCCESS:
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.item._id
            ? {
                ...action.payload.item,
                isOrdered: action.payload.item.isOrdered
              }
            : item
        )
      };
    case ItemActionTypes.VOTE_SUCCESS:
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.item._id
            ? {
                ...action.payload.item,
                voterIds: action.payload.item.voterIds
              }
            : item
        )
      };
    case ItemActionTypes.UPDATE_DETAILS_SUCCESS: {
      const {
        payload: {
          data: { description, link },
          itemId
        }
      } = action;

      return {
        ...state,
        items: state.items.map(item =>
          item._id === itemId
            ? {
                ...item,
                description: description || item.description,
                link: link || item.link
              }
            : item
        )
      };
    }
    default:
      return state;
  }
};

const membersReducer = (state, action) => {
  switch (action.type) {
    case ListActionTypes.ADD_VIEWER_SUCCESS: {
      const {
        payload: { data }
      } = action;
      return [...state, data];
    }
    case ListActionTypes.REMOVE_MEMBER_SUCCESS: {
      const {
        payload: { userId }
      } = action;
      return state.filter(member => member._id !== userId);
    }
    case ListActionTypes.ADD_OWNER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return state.map(member =>
        member._id === userId
          ? {
              ...member,
              isOwner: true,
              isMember: true
            }
          : member
      );
    }
    case ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return state.map(member =>
        member._id === userId
          ? {
              ...member,
              isOwner: false
            }
          : member
      );
    }
    case ListActionTypes.ADD_MEMBER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return state.map(member =>
        member._id === userId
          ? {
              ...member,
              isMember: true
            }
          : member
      );
    }
    case ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return state.map(member =>
        member._id === userId
          ? {
              ...member,
              isMember: false,
              isOwner: false
            }
          : member
      );
    }
    default:
      return state;
  }
};

const lists = (state = {}, action) => {
  switch (action.type) {
    case ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
      return { ...state, ...action.payload };
    case ListActionTypes.FETCH_META_DATA_SUCCESS:
      return { ...action.payload };
    case ListActionTypes.CREATE_SUCCESS:
      return { [action.payload._id]: { ...action.payload }, ...state };
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
      return { ...state, [action.payload.listId]: updatedList };
    }
    case ListActionTypes.ARCHIVE_SUCCESS: {
      const { listId: _id, isArchived } = action.payload;
      const { cohortId, name } = state[action.payload.listId];
      const archivedList = { cohortId, _id, isArchived, name };
      return { ...state, [action.payload.listId]: archivedList };
    }
    case ListActionTypes.RESTORE_SUCCESS:
    case ListActionTypes.FETCH_DATA_SUCCESS:
      return { ...state, [action.payload.listId]: action.payload.data };
    case ListActionTypes.REMOVE_ARCHIVED_META_DATA:
      return _keyBy(_filter(state, list => !list.isArchived), '_id');
    case CohortActionTypes.ARCHIVE_SUCCESS:
      return {};
    case ItemActionTypes.ADD_SUCCESS: {
      const currentList = state[action.payload.listId];
      return { ...state, [action.payload.listId]: items(currentList, action) };
    }
    case ItemActionTypes.TOGGLE_SUCCESS: {
      const currentList = state[action.payload.listId];
      return { ...state, [action.payload.listId]: items(currentList, action) };
    }
    case ItemActionTypes.VOTE_SUCCESS: {
      const currentList = state[action.payload.listId];
      return { ...state, [action.payload.listId]: items(currentList, action) };
    }
    case ListActionTypes.FAVOURITES_SUCCESS: {
      const {
        payload: { listId, isFavourite }
      } = action;
      return { ...state, [listId]: { ...state[listId], isFavourite } };
    }
    case ListActionTypes.ADD_VIEWER_SUCCESS:
    case ListActionTypes.ADD_OWNER_ROLE_SUCCESS:
    case ListActionTypes.REMOVE_MEMBER_SUCCESS:
    case ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS:
    case ListActionTypes.ADD_MEMBER_ROLE_SUCCESS:
    case ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS: {
      const {
        payload: { listId }
      } = action;
      const { members } = state[listId];
      return {
        ...state,
        [listId]: { ...state[listId], members: membersReducer(members, action) }
      };
    }
    case ItemActionTypes.UPDATE_DETAILS_SUCCESS: {
      const currentList = state[action.payload.listId];
      return { ...state, [action.payload.listId]: items(currentList, action) };
    }
    default:
      return state;
  }
};

const isFetching = (state = false, action) => {
  switch (action.type) {
    case ItemActionTypes.UPDATE_DETAILS_SUCCESS:
    case ItemActionTypes.ADD_FAILURE:
    case ItemActionTypes.ADD_SUCCESS:
    case ItemActionTypes.TOGGLE_FAILURE:
    case ItemActionTypes.TOGGLE_SUCCESS:
    case ItemActionTypes.VOTE_FAILURE:
    case ItemActionTypes.VOTE_SUCCESS:
    case ListActionTypes.ARCHIVE_FAILURE:
    case ListActionTypes.ARCHIVE_SUCCESS:
    case ListActionTypes.CREATE_FAILURE:
    case ListActionTypes.CREATE_SUCCESS:
    case ListActionTypes.DELETE_FAILURE:
    case ListActionTypes.DELETE_SUCCESS:
    case ListActionTypes.FAVOURITES_FAILURE:
    case ListActionTypes.FAVOURITES_SUCCESS:
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
    case ItemActionTypes.UPDATE_DETAILS_FAILURE:
    case ItemActionTypes.UPDATE_DETAILS_REQUEST:
    case ItemActionTypes.ADD_REQUEST:
    case ItemActionTypes.TOGGLE_REQUEST:
    case ItemActionTypes.VOTE_REQUEST:
    case ListActionTypes.ARCHIVE_REQUEST:
    case ListActionTypes.CREATE_REQUEST:
    case ListActionTypes.DELETE_REQUEST:
    case ListActionTypes.FAVOURITES_REQUEST:
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
