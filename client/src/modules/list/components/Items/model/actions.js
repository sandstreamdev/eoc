import _keyBy from 'lodash/keyBy';

import { getJson, patchData, postData } from 'common/utils/fetchMethods';
import {
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType
} from 'modules/list/components/Items/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { ITEM_TOGGLE_TIME } from '../ListItem/constants';
import socket from 'sockets';

const addItemFailure = () => ({
  type: ItemActionTypes.ADD_FAILURE
});

export const addItemSuccess = payload => ({
  type: ItemActionTypes.ADD_SUCCESS,
  payload
});

const toggleItemSuccess = payload => ({
  type: ItemActionTypes.TOGGLE_SUCCESS,
  payload
});

const toggleItemFailure = () => ({
  type: ItemActionTypes.TOGGLE_FAILURE
});

const setVoteSuccess = payload => ({
  type: ItemActionTypes.SET_VOTE_SUCCESS,
  payload
});

const setVoteFailure = () => ({
  type: ItemActionTypes.SET_VOTE_FAILURE
});

const clearVoteSuccess = payload => ({
  type: ItemActionTypes.CLEAR_VOTE_SUCCESS,
  payload
});

const clearVoteFailure = () => ({
  type: ItemActionTypes.CLEAR_VOTE_FAILURE
});

const updateListItemSuccess = payload => ({
  type: ItemActionTypes.UPDATE_SUCCESS,
  payload
});

const updateListItemFailure = () => ({
  type: ItemActionTypes.UPDATE_FAILURE
});

const cloneItemSuccess = payload => ({
  type: ItemActionTypes.CLONE_SUCCESS,
  payload
});

const cloneItemFailure = () => ({
  type: ItemActionTypes.CLONE_FAILURE
});

const addCommentSuccess = payload => ({
  type: CommentActionTypes.ADD_SUCCESS,
  payload
});

const addCommentFailure = () => ({
  type: CommentActionTypes.ADD_FAILURE
});

const fetchCommentsSuccess = payload => ({
  type: CommentActionTypes.FETCH_SUCCESS,
  payload
});

const fetchCommentsFailure = () => ({
  type: CommentActionTypes.FETCH_FAILURE
});

const archiveItemSuccess = payload => ({
  type: ItemActionTypes.ARCHIVE_SUCCESS,
  payload
});

const archiveItemFailure = () => ({
  type: ItemActionTypes.ARCHIVE_FAILURE
});

const restoreItemSuccess = payload => ({
  type: ItemActionTypes.RESTORE_SUCCESS,
  payload
});

const restoreItemFailure = () => ({
  type: ItemActionTypes.RESTORE_FAILURE
});

const deleteItemSuccess = payload => ({
  type: ItemActionTypes.DELETE_SUCCESS,
  payload
});

const deleteItemFailure = () => ({
  type: ItemActionTypes.DELETE_FAILURE
});

const fetchArchivedItemsSuccess = payload => ({
  type: ItemActionTypes.FETCH_ARCHIVED_SUCCESS,
  payload
});

const fetchArchivedItemsFailure = () => ({
  type: ItemActionTypes.FETCH_ARCHIVE_FAILURE
});

export const removeArchivedItems = payload => ({
  type: ItemActionTypes.REMOVE_ARCHIVED,
  payload
});

export const addItem = (item, listId) => dispatch =>
  postData('/api/lists/add-item', { item, listId })
    .then(response => response.json())
    .then(json => {
      const action = addItemSuccess({ item: json, listId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
    })
    .catch(() => {
      dispatch(addItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.add-item-fail',
        data: item.name
      });
    });

export const toggle = (
  itemName,
  isOrdered,
  itemId,
  listId,
  authorId,
  authorName
) => dispatch =>
  patchData(`/api/lists/${listId}/update-item`, {
    authorId,
    isOrdered: !isOrdered,
    itemId
  })
    .then(() => {
      const data = { authorId, authorName, itemId, listId };
      const action = toggleItemSuccess(data);
      const { type, payload } = action;

      socket.emit(type, payload);
      setTimeout(() => dispatch(action), ITEM_TOGGLE_TIME);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.toggle',
        data: itemName
      });
    })
    .catch(() => {
      dispatch(toggleItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.toggle-fail',
        data: itemName
      });
    });

export const setVote = (itemId, listId, itemName) => dispatch =>
  patchData(`/api/lists/${listId}/set-vote`, { itemId })
    .then(() => {
      const action = setVoteSuccess({ itemId, listId, isVoted: true });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
    })
    .catch(() => {
      dispatch(setVoteFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.set-vote-fail',
        data: itemName
      });
    });

export const clearVote = (itemId, listId, itemName) => dispatch =>
  patchData(`/api/lists/${listId}/clear-vote`, { itemId })
    .then(() => {
      const action = clearVoteSuccess({ itemId, listId, isVoted: false });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
    })
    .catch(() => {
      dispatch(clearVoteFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.clear-vote-fail',
        data: itemName
      });
    });

export const updateListItem = (itemName, listId, itemId, data) => dispatch =>
  patchData(`/api/lists/${listId}/update-item`, {
    ...data,
    itemId
  })
    .then(() => {
      const action = updateListItemSuccess({ listId, itemId, data });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.update-item',
        data: itemName
      });
    })
    .catch(() => {
      dispatch(updateListItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.update-item-fail',
        data: itemName
      });
    });

export const cloneItem = (itemName, listId, itemId) => dispatch =>
  patchData(`/api/lists/${listId}/clone-item`, {
    itemId
  })
    .then(response => response.json())
    .then(json => {
      const { item } = json;
      const action = cloneItemSuccess({ listId, item });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.clone-item',
        data: itemName
      });
    })
    .catch(() => {
      dispatch(cloneItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.clone-item-fail',
        data: itemName
      });
    });

export const addComment = (listId, itemId, text) => dispatch =>
  postData('/api/comments/add-comment', {
    itemId,
    listId,
    text
  })
    .then(response => response.json())
    .then(json => {
      const action = addCommentSuccess({ listId, itemId, comment: json });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
    })
    .catch(() => {
      dispatch(addCommentFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.add-comment-fail',
        data: text
      });
    });

export const fetchComments = (itemName, listId, itemId) => dispatch =>
  getJson(`/api/comments/${listId}/${itemId}/data`)
    .then(json => {
      const comments = _keyBy(json, '_id');
      dispatch(fetchCommentsSuccess({ listId, itemId, comments }));
    })
    .catch(() => {
      dispatch(fetchCommentsFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.fetch-comments-fails',
        data: itemName
      });
    });

export const archiveItem = (listId, itemId, name) => dispatch =>
  patchData(`/api/lists/${listId}/update-item`, {
    isArchived: true,
    itemId
  })
    .then(() => {
      const action = archiveItemSuccess({ listId, itemId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.archive-item',
        data: name
      });
    })
    .catch(() => {
      dispatch(archiveItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.archive-item-fail',
        data: name
      });
    });

export const fetchArchivedItems = (listId, listName) => dispatch =>
  getJson(`/api/lists/${listId}/archived-items`)
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedItemsSuccess({ listId, dataMap }));
    })
    .catch(() => {
      dispatch(fetchArchivedItemsFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.fetch-archived',
        data: listName
      });
    });

export const restoreItem = (listId, itemId, name) => dispatch =>
  patchData(`/api/lists/${listId}/update-item`, {
    isArchived: false,
    itemId
  })
    .then(() => {
      const action = restoreItemSuccess({ listId, itemId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.restore-item',
        data: name
      });
    })
    .catch(() => {
      dispatch(restoreItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.action.restore-item-fail',
        data: name
      });
    });

export const deleteItem = (listId, itemId, name) => dispatch =>
  patchData(`/api/lists/${listId}/delete-item/${itemId}`)
    .then(() => {
      const action = deleteItemSuccess({ listId, itemId });
      const { type, payload } = action;

      socket.emit(type, payload);
      dispatch(action);
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.delete-item',
        data: name
      });
    })
    .catch(() => {
      dispatch(deleteItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.delete-item-fail',
        data: name
      });
    });

export const lockItem = (
  itemId,
  listId,
  userId,
  { nameLock, descriptionLock }
) =>
  socket.emit(ItemStatusType.LOCK, {
    descriptionLock,
    itemId,
    listId,
    nameLock,
    userId
  });

export const unlockItem = (
  itemId,
  listId,
  userId,
  { nameLock, descriptionLock }
) =>
  socket.emit(ItemStatusType.UNLOCK, {
    descriptionLock,
    itemId,
    listId,
    nameLock,
    userId
  });
