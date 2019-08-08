import _filter from 'lodash/filter';
import _keyBy from 'lodash/keyBy';

import {
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType
} from 'modules/list/components/Items/model/actionTypes';

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
        payload: { item }
      } = action;

      return { [item._id]: item, ...state };
    }
    case ItemActionTypes.TOGGLE_SUCCESS: {
      const {
        payload: { authorId, authorName, itemId }
      } = action;
      const previousItem = state[itemId];

      return {
        ...state,
        [itemId]: {
          ...state[itemId],
          authorId: authorId || previousItem.authorId,
          authorName: authorName || previousItem.authorName,
          isOrdered: !previousItem.isOrdered
        }
      };
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
          data: { description, name },
          editedBy,
          itemId
        }
      } = action;
      const previousItem = state[itemId];
      const previousDescription = previousItem.description;
      const newDescription = name ? previousDescription : description;

      return {
        ...state,
        [itemId]: {
          ...previousItem,
          description: newDescription,
          name: name || previousItem.name,
          editedBy
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
        payload: { itemId, descriptionLock, nameLock }
      } = action;
      const blockedItem = state[itemId];
      blockedItem.descriptionLock = descriptionLock;
      blockedItem.nameLock = nameLock;

      return { [itemId]: blockedItem, ...state };
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
