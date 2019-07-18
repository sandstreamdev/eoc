import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { ListActionTypes } from './actionTypes';
import {
  CommentActionTypes,
  ItemActionTypes
} from 'modules/list/components/Items/model/actionTypes';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';
import items from 'modules/list/components/Items/model/reducer';
import { ListType } from 'modules/list/consts';

const membersReducer = (state = {}, action) => {
  switch (action.type) {
    case ListActionTypes.ADD_VIEWER_SUCCESS: {
      const {
        payload: {
          viewer,
          viewer: { _id }
        }
      } = action;

      return { [_id]: viewer, ...state };
    }
    case ListActionTypes.REMOVE_MEMBER_SUCCESS:
    case ListActionTypes.LEAVE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      const { [userId]: deleted, ...rest } = state;

      return rest;
    }
    case ListActionTypes.ADD_OWNER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return {
        ...state,
        [userId]: { ...state[userId], isOwner: true, isMember: true }
      };
    }
    case ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return {
        ...state,
        [userId]: { ...state[userId], isOwner: false }
      };
    }
    case ListActionTypes.ADD_MEMBER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return {
        ...state,
        [userId]: { ...state[userId], isMember: true }
      };
    }
    case ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS: {
      const {
        payload: { userId }
      } = action;

      return {
        ...state,
        [userId]: { ...state[userId], isOwner: false, isMember: false }
      };
    }
    case ListActionTypes.CHANGE_TYPE_SUCCESS: {
      const {
        payload: {
          data: { members }
        }
      } = action;

      return members;
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
      return { ...state, ...action.payload };
    case ListActionTypes.CREATE_SUCCESS:
      return { [action.payload._id]: { ...action.payload }, ...state };
    case ListActionTypes.DELETE_SUCCESS:
    case ListActionTypes.LEAVE_SUCCESS: {
      const { [action.payload]: removed, ...newState } = state;

      return newState;
    }
    case ListActionTypes.UPDATE_SUCCESS: {
      const { description, listId, name } = action.payload;
      const prevList = state[listId];
      const { name: prevName, description: prevDescription } = prevList;
      const newDescription = name ? prevDescription : description;

      const updatedList = {
        ...prevList,
        name: name || prevName,
        description: newDescription
      };

      return { ...state, [listId]: updatedList };
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
    case ListActionTypes.FAVOURITES_SUCCESS: {
      const {
        payload: { listId, isFavourite }
      } = action;

      return { ...state, [listId]: { ...state[listId], isFavourite } };
    }
    case ListActionTypes.ADD_VIEWER_SUCCESS:
    case ListActionTypes.ADD_OWNER_ROLE_SUCCESS:
    case ListActionTypes.ADD_MEMBER_ROLE_SUCCESS:
    case ListActionTypes.REMOVE_MEMBER_SUCCESS: {
      const {
        payload: { listId }
      } = action;
      const { members } = state[listId];

      return {
        ...state,
        [listId]: { ...state[listId], members: membersReducer(members, action) }
      };
    }
    case ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        payload: { isCurrentUserRoleChanging, listId }
      } = action;
      const { members } = state[listId];
      const list = {
        ...state[listId],
        members: membersReducer(members, action)
      };

      if (isCurrentUserRoleChanging) {
        list.isOwner = false;
      }

      return { ...state, [listId]: list };
    }
    case ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS: {
      const {
        payload: { isCurrentUserRoleChanging, listId }
      } = action;
      const { members } = state[listId];
      const list = {
        ...state[listId],
        members: membersReducer(members, action)
      };

      if (isCurrentUserRoleChanging) {
        list.isMember = false;
        list.isOwner = false;
      }

      return { ...state, [listId]: list };
    }
    case ListActionTypes.CHANGE_TYPE_SUCCESS: {
      const {
        payload: {
          data: { type },
          listId
        }
      } = action;
      const { members } = state[listId];

      return {
        ...state,
        [listId]: {
          ...state[listId],
          type,
          members: membersReducer(members, action)
        }
      };
    }
    case CohortActionTypes.ARCHIVE_SUCCESS:
      return {};
    case CohortActionTypes.LEAVE_SUCCESS: {
      const { payload: leavedCohortId } = action;

      return _keyBy(
        _filter(state, list => {
          const { cohortId, isMember, type } = list;

          if (
            !cohortId ||
            cohortId !== leavedCohortId ||
            type === ListType.LIMITED ||
            (type === ListType.SHARED && isMember)
          ) {
            return list;
          }
        }),
        '_id'
      );
    }
    case ItemActionTypes.ADD_SUCCESS:
    case ItemActionTypes.ARCHIVE_SUCCESS:
    case ItemActionTypes.CLEAR_VOTE_SUCCESS:
    case ItemActionTypes.CLONE_SUCCESS:
    case ItemActionTypes.DELETE_SUCCESS:
    case ItemActionTypes.FETCH_ARCHIVED_SUCCESS:
    case ItemActionTypes.REMOVE_ARCHIVED:
    case ItemActionTypes.RESTORE_SUCCESS:
    case ItemActionTypes.SET_VOTE_SUCCESS:
    case ItemActionTypes.TOGGLE_SUCCESS:
    case ItemActionTypes.UPDATE_SUCCESS:
    case CommentActionTypes.ADD_SUCCESS:
    case CommentActionTypes.FETCH_SUCCESS: {
      const {
        payload: { listId }
      } = action;
      const { items: prevItems } = state[listId];

      return {
        ...state,
        [listId]: { ...state[listId], items: items(prevItems, action) }
      };
    }
    default:
      return state;
  }
};

export default lists;
