import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import { ListActionTypes, ListHeaderStatusType } from './actionTypes';
import {
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType
} from 'modules/list/components/Items/model/actionTypes';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';
import items from 'modules/list/components/Items/model/reducer';
import { ListType } from 'modules/list/consts';
import { filterDefined } from 'common/utils/helpers';
import { CommonActionTypes } from 'common/model/actionTypes';
import { DISPLAY_LIMIT } from 'common/constants/variables';

const listState = {
  archivedLimit: DISPLAY_LIMIT,
  areArchivedItemsDisplayed: false,
  doneLimit: DISPLAY_LIMIT,
  unhandledLimit: DISPLAY_LIMIT
};

const membersReducer = (state = {}, action) => {
  switch (action.type) {
    case ListActionTypes.ADD_VIEWER_SUCCESS: {
      const {
        viewer,
        viewer: { _id }
      } = action.payload;

      return { [_id]: viewer, ...state };
    }
    case ListActionTypes.REMOVE_MEMBER_SUCCESS: {
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
    case ListActionTypes.MEMBER_UPDATE_SUCCESS: {
      const {
        payload: { userId, listId, isCurrentUserUpdated, ...data }
      } = action;
      const previousMember = state[userId];
      const dataToUpdate = filterDefined(data);
      const updatedMember = { ...previousMember, ...dataToUpdate };

      return {
        ...state,
        [userId]: updatedMember
      };
    }
    case ListActionTypes.CHANGE_TYPE_SUCCESS: {
      const {
        payload: { members }
      } = action;

      if (members) {
        return members;
      }

      return state;
    }
    default:
      return state;
  }
};

const lists = (state = {}, action) => {
  switch (action.type) {
    case ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS:
      return { ...state, ...action.payload };
    case ListActionTypes.FETCH_AVAILABLE_SUCCESS:
      return { ...action.payload, ...state };
    case ListActionTypes.FETCH_META_DATA_SUCCESS:
      return { ...state, ...action.payload };
    case ListActionTypes.CREATE_SUCCESS:
      return { ...state, [action.payload._id]: { ...action.payload } };
    case ListActionTypes.ARCHIVE_SUCCESS: {
      const { listId, externalAction } = action.payload;

      if (state[listId]) {
        return {
          ...state,
          [listId]: { ...state[listId], isArchived: true, externalAction }
        };
      }

      return state;
    }
    case ListActionTypes.DELETE_SUCCESS: {
      const { listId, externalAction } = action.payload;

      if (state[listId]) {
        if (!externalAction) {
          const { [listId]: removed, ...newState } = state;

          return newState;
        }

        return {
          ...state,
          [listId]: { ...state[listId], isDeleted: true, externalAction }
        };
      }

      return state;
    }
    case ListActionTypes.LEAVE_SUCCESS: {
      const { [action.payload.listId]: removed, ...newState } = state;

      return newState;
    }
    case ListActionTypes.UPDATE_SUCCESS: {
      const { listId, ...data } = action.payload;
      const previousList = state[listId];
      if (previousList) {
        const dataToUpdate = filterDefined(data);

        const updatedList = {
          ...previousList,
          ...dataToUpdate
        };

        return { ...state, [listId]: updatedList };
      }

      return state;
    }
    case ListActionTypes.RESTORE_SUCCESS:
    case ListActionTypes.FETCH_DATA_SUCCESS: {
      const { data, listId } = action.payload;

      return {
        ...state,
        [listId]: {
          ...data,
          listState
        }
      };
    }
    case ListActionTypes.REMOVE_ARCHIVED_META_DATA:
      return _keyBy(_filter(state, list => !list.isArchived), '_id');
    case ListActionTypes.REMOVE_BY_IDS: {
      const { payload } = action;
      const listsToRemove = new Set(payload);

      return _keyBy(
        _filter(state, list => !listsToRemove.has(list._id)),
        '_id'
      );
    }
    case ListActionTypes.FAVOURITES_SUCCESS: {
      const {
        payload: { listId, isFavourite }
      } = action;

      return { ...state, [listId]: { ...state[listId], isFavourite } };
    }
    case ListActionTypes.ADD_VIEWER_SUCCESS:
    case ListActionTypes.REMOVE_MEMBER_SUCCESS: {
      const {
        payload: { listId, externalAction }
      } = action;

      if (state[listId]) {
        const { members } = state[listId];
        const list = {
          ...state[listId],
          members: membersReducer(members, action),
          externalAction
        };

        return { ...state, [listId]: list };
      }

      return state;
    }
    case ListActionTypes.ADD_OWNER_ROLE_SUCCESS: {
      const {
        payload: { isCurrentUserRoleChanging, listId }
      } = action;

      if (state[listId]) {
        const { members } = state[listId];
        if (members) {
          const list = {
            ...state[listId],
            members: membersReducer(members, action)
          };

          if (isCurrentUserRoleChanging) {
            list.isOwner = true;
            list.isMember = true;
          }

          return { ...state, [listId]: list };
        }
      }

      return state;
    }
    case ListActionTypes.ADD_MEMBER_ROLE_SUCCESS: {
      const {
        payload: { isCurrentUserRoleChanging, listId }
      } = action;

      if (state[listId]) {
        const { members } = state[listId];

        if (members) {
          const list = {
            ...state[listId],
            members: membersReducer(members, action)
          };

          if (isCurrentUserRoleChanging) {
            list.isMember = true;
          }

          return { ...state, [listId]: list };
        }
      }

      return state;
    }
    case ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS: {
      const {
        payload: { isCurrentUserRoleChanging, listId }
      } = action;

      if (state[listId]) {
        const { members } = state[listId];

        if (members) {
          const list = {
            ...state[listId],
            members: membersReducer(members, action)
          };

          if (isCurrentUserRoleChanging) {
            list.isOwner = false;
          }

          return { ...state, [listId]: list };
        }
      }

      return state;
    }
    case ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS: {
      const {
        payload: { isCurrentUserRoleChanging, listId }
      } = action;

      if (state[listId]) {
        const { members } = state[listId];

        if (members) {
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
      }

      return state;
    }
    case ListActionTypes.MEMBER_UPDATE_SUCCESS: {
      const {
        payload: { isCurrentUserUpdated, isGuest, listId }
      } = action;

      if (state[listId]) {
        const { members } = state[listId];
        const list = {
          ...state[listId],
          members: membersReducer(members, action)
        };

        if (isCurrentUserUpdated) {
          list.isGuest = isGuest;
        }

        return { ...state, [listId]: list };
      }

      return state;
    }
    case ListActionTypes.CHANGE_TYPE_SUCCESS: {
      const {
        payload: { externalAction, listId, type }
      } = action;

      if (state[listId]) {
        const { members } = state[listId];

        return {
          ...state,
          [listId]: {
            ...state[listId],
            externalAction,
            type,
            members: membersReducer(members, action)
          }
        };
      }

      return state;
    }
    case CommonActionTypes.LEAVE_VIEW: {
      return {};
    }

    case CohortActionTypes.ARCHIVE_SUCCESS: {
      const { performer } = action.payload;

      if (performer) {
        return state;
      }

      return {};
    }

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
    case ListActionTypes.UPDATE_LIMIT_SUCCESS: {
      const {
        payload: { listId, limit }
      } = action;

      const updatedState = { ...state[listId].listState, ...limit };

      return {
        ...state,
        [listId]: {
          ...state[listId],
          listState: updatedState
        }
      };
    }
    case CommentActionTypes.ADD_SUCCESS:
    case CommentActionTypes.FETCH_SUCCESS:
    case ItemActionTypes.CLEAR_VOTE_SUCCESS:
    case ItemActionTypes.CLONE_SUCCESS:
    case ItemActionTypes.DELETE_SUCCESS:
    case ItemActionTypes.SET_VOTE_SUCCESS:
    case ItemActionTypes.UPDATE_SUCCESS:
    case ItemStatusType.LOCK:
    case ItemStatusType.UNLOCK:
    case ItemActionTypes.DISABLE_ANIMATIONS: {
      const {
        payload: { listId }
      } = action;
      const list = state[listId];

      if (list && list.items) {
        const { items: previousItems } = list;

        return {
          ...state,
          [listId]: { ...list, items: items(previousItems, action) }
        };
      }

      return state;
    }
    case ItemActionTypes.FETCH_ARCHIVED_SUCCESS: {
      const {
        payload: { listId }
      } = action;

      const list = state[listId];

      if (list && list.items) {
        const { items: previousItems, listState } = list;

        listState.areArchivedItemsDisplayed = true;

        return {
          ...state,
          [listId]: {
            ...list,
            listState,
            items: items(previousItems, action)
          }
        };
      }

      return state;
    }
    case ItemActionTypes.REMOVE_ARCHIVED: {
      const {
        payload: { listId }
      } = action;

      const list = state[listId];

      if (list && list.items) {
        const { items: previousItems, listState } = list;

        listState.areArchivedItemsDisplayed = false;

        return {
          ...state,
          [listId]: {
            ...list,
            listState,
            items: items(previousItems, action)
          }
        };
      }

      return state;
    }
    case ItemActionTypes.ADD_SUCCESS:
    case ItemActionTypes.ARCHIVE_SUCCESS:
    case ItemActionTypes.MARK_AS_DONE_SUCCESS:
    case ItemActionTypes.MARK_AS_UNHANDLED_SUCCESS:
    case ItemActionTypes.RESTORE_SUCCESS: {
      const {
        payload,
        payload: { listId },
        type
      } = action;

      const list = state[listId];

      if (list && list.items) {
        const { items: previousItems } = list;
        const { listState } = list;

        return {
          ...state,
          [listId]: {
            ...list,
            items: items(previousItems, {
              payload: { ...payload, listState },
              type
            })
          }
        };
      }

      return state;
    }
    case ListHeaderStatusType.LOCK:
    case ListHeaderStatusType.UNLOCK: {
      const {
        payload: { listId, locks }
      } = action;
      const { locks: prevLocks } = state[listId];
      const updatedLocks = filterDefined(locks);

      return {
        ...state,
        [listId]: {
          ...state[listId],
          locks: { ...prevLocks, ...updatedLocks }
        }
      };
    }
    default:
      return state;
  }
};

export default lists;
