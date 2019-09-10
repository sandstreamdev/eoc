import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import {
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType
} from 'modules/list/components/Items/model/actionTypes';
import { filterDefined } from 'common/utils/helpers';

const comments = (state = {}, action) => {
  switch (action.type) {
    case CommentActionTypes.ADD_SUCCESS: {
      const {
        payload: { comment }
      } = action;

      return { [comment._id]: comment, ...state };
    }
    case CommentActionTypes.FETCH_SUCCESS: {
      const {
        payload: { comments }
      } = action;

      return comments;
    }
    default:
      return state;
  }
};

const items = (state = {}, action) => {
  switch (action.type) {
    case ItemActionTypes.ADD_SUCCESS:
    case ItemActionTypes.CLONE_SUCCESS: {
      const {
        payload: {
          item,
          item: { _id }
        }
      } = action;

      return { [_id]: item, ...state };
    }
    case ItemActionTypes.SET_VOTE_SUCCESS: {
      const {
        payload: { itemId, isVoted }
      } = action;

      const previousItem = state[itemId];

      return {
        ...state,
        [itemId]: {
          ...previousItem,
          isVoted: isVoted !== undefined ? isVoted : previousItem.isVoted,
          votesCount: previousItem.votesCount + 1
        }
      };
    }
    case ItemActionTypes.CLEAR_VOTE_SUCCESS: {
      const {
        payload: { itemId, isVoted }
      } = action;

      const previousItem = state[itemId];

      return {
        ...state,
        [itemId]: {
          ...previousItem,
          isVoted: isVoted !== undefined ? isVoted : previousItem.isVoted,
          votesCount: previousItem.votesCount - 1
        }
      };
    }
    case ItemActionTypes.UPDATE_SUCCESS: {
      const {
        payload: {
          item,
          item: { _id: itemId }
        }
      } = action;

      const updatedItem = filterDefined(item);
      const previousItem = state[itemId];

      return {
        ...state,
        [itemId]: {
          ...previousItem,
          ...updatedItem
        }
      };
    }
    case ItemActionTypes.ARCHIVE_SUCCESS: {
      const {
        payload: { itemId }
      } = action;
      const previousItem = state[itemId];

      return {
        ...state,
        [itemId]: {
          ...previousItem,
          isArchived: true
        }
      };
    }
    case ItemActionTypes.RESTORE_SUCCESS: {
      const {
        payload: { itemId }
      } = action;
      const previousItem = state[itemId];

      return {
        ...state,
        [itemId]: {
          ...previousItem,
          isArchived: false
        }
      };
    }
    case ItemActionTypes.FETCH_ARCHIVED_SUCCESS: {
      const {
        payload: { data }
      } = action;

      return { ...state, ...data };
    }
    case ItemActionTypes.REMOVE_ARCHIVED:
      return _keyBy(_filter(state, item => !item.isArchived), '_id');
    case ItemActionTypes.MOVE_SUCCESS:
    case ItemActionTypes.DELETE_SUCCESS: {
      const {
        payload: { itemId }
      } = action;
      const { [itemId]: deleted, ...rest } = state;

      return rest;
    }
    case ItemStatusType.LOCK:
    case ItemStatusType.UNLOCK: {
      const {
        payload: { itemId, locks }
      } = action;
      const blockedItem = state[itemId];
      const { locks: prevLocks } = blockedItem;
      const updatedLocks = filterDefined(locks);

      return {
        ...state,
        [itemId]: {
          ...blockedItem,
          locks: { ...prevLocks, ...updatedLocks }
        }
      };
    }
    case CommentActionTypes.ADD_SUCCESS:
    case CommentActionTypes.FETCH_SUCCESS: {
      const {
        payload: { itemId }
      } = action;
      const { comments: previousComments } = state[itemId];

      return {
        ...state,
        [itemId]: {
          ...state[itemId],
          comments: comments(previousComments, action)
        }
      };
    }
    default:
      return state;
  }
};

export default items;
