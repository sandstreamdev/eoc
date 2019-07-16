import _keyBy from 'lodash/keyBy';

import { getData, patchData, postData } from 'common/utils/fetchMethods';
import {
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType
} from 'modules/list/components/Items/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { ITEM_TOGGLE_TIME } from '../ListItem/constants';
import socket from 'sockets';

const addItemFailure = errorMessage => ({
  type: ItemActionTypes.ADD_FAILURE,
  payload: errorMessage
});

export const addItemSuccess = (item, listId) => ({
  type: ItemActionTypes.ADD_SUCCESS,
  payload: { item, listId }
});

const toggleItemSuccess = (authorId, authorName, itemId, listId) => ({
  type: ItemActionTypes.TOGGLE_SUCCESS,
  payload: { authorId, authorName, itemId, listId }
});

const toggleItemFailure = errMessage => ({
  type: ItemActionTypes.TOGGLE_FAILURE,
  payload: errMessage
});

const setVoteSuccess = (itemId, listId) => ({
  type: ItemActionTypes.SET_VOTE_SUCCESS,
  payload: { itemId, listId }
});

const setVoteFailure = errMessage => ({
  type: ItemActionTypes.SET_VOTE_FAILURE,
  payload: errMessage
});

const clearVoteSuccess = (itemId, listId) => ({
  type: ItemActionTypes.CLEAR_VOTE_SUCCESS,
  payload: { itemId, listId }
});

const clearVoteFailure = errMessage => ({
  type: ItemActionTypes.CLEAR_VOTE_FAILURE,
  payload: errMessage
});

const updateListItemSuccess = (listId, itemId, data) => ({
  type: ItemActionTypes.UPDATE_SUCCESS,
  payload: { listId, itemId, data }
});

const updateListItemFailure = () => ({
  type: ItemActionTypes.UPDATE_FAILURE
});

const cloneItemSuccess = (listId, item) => ({
  type: ItemActionTypes.CLONE_SUCCESS,
  payload: { listId, item }
});

const cloneItemFailure = () => ({
  type: ItemActionTypes.CLONE_FAILURE
});

const addCommentSuccess = (listId, itemId, comment) => ({
  type: CommentActionTypes.ADD_SUCCESS,
  payload: { comment, itemId, listId }
});

const addCommentFailure = () => ({
  type: CommentActionTypes.ADD_FAILURE
});

const fetchCommentsSuccess = (listId, itemId, comments) => ({
  type: CommentActionTypes.FETCH_SUCCESS,
  payload: { comments, itemId, listId }
});

const fetchCommentsFailure = () => ({
  type: CommentActionTypes.FETCH_FAILURE
});

const archiveItemSuccess = (listId, itemId) => ({
  type: ItemActionTypes.ARCHIVE_SUCCESS,
  payload: { itemId, listId }
});

const archiveItemFailure = () => ({
  type: ItemActionTypes.ARCHIVE_FAILURE
});

const restoreItemSuccess = (listId, itemId) => ({
  type: ItemActionTypes.RESTORE_SUCCESS,
  payload: { itemId, listId }
});

const restoreItemFailure = () => ({
  type: ItemActionTypes.RESTORE_FAILURE
});

const deleteItemSuccess = (listId, itemId) => ({
  type: ItemActionTypes.DELETE_SUCCESS,
  payload: { itemId, listId }
});

const deleteItemFailure = () => ({
  type: ItemActionTypes.DELETE_FAILURE
});

const fetchArchivedItemsSuccess = (listId, data) => ({
  type: ItemActionTypes.FETCH_ARCHIVED_SUCCESS,
  payload: { listId, data }
});

const fetchArchivedItemsFailure = () => ({
  type: ItemActionTypes.FETCH_ARCHIVE_FAILURE
});

export const removeArchivedItems = listId => ({
  type: ItemActionTypes.REMOVE_ARCHIVED,
  payload: { listId }
});

export const addItem = (item, listId) => dispatch =>
  postData('/api/lists/add-item', { item, listId })
    .then(resp => resp.json())
    .then(json => {
      const data = {
        item: json,
        listId
      };
      socket.emit(ItemActionTypes.ADD_SUCCESS, data);
      dispatch(addItemSuccess(json, listId));
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
      setTimeout(
        () => dispatch(toggleItemSuccess(authorId, authorName, itemId, listId)),
        ITEM_TOGGLE_TIME
      );
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
    .then(() => dispatch(setVoteSuccess(itemId, listId)))
    .catch(() => {
      dispatch(setVoteFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.set-vote-fail',
        data: itemName
      });
    });

export const clearVote = (itemId, listId, itemName) => dispatch =>
  patchData(`/api/lists/${listId}/clear-vote`, { itemId })
    .then(() => dispatch(clearVoteSuccess(itemId, listId)))
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
      dispatch(updateListItemSuccess(listId, itemId, data));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.update-item',
        data: itemName
      });
      socket.emit(ItemActionTypes.UPDATE_SUCCESS, {
        listId,
        itemId,
        data
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
    .then(resp => resp.json())
    .then(json => {
      const { item } = json;

      dispatch(cloneItemSuccess(listId, item));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.clone-item',
        data: itemName
      });
      socket.emit(ItemActionTypes.CLONE_SUCCESS, { listId, item });
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
    .then(resp => resp.json())
    .then(json => {
      dispatch(addCommentSuccess(listId, itemId, json));
      socket.emit(CommentActionTypes.ADD_SUCCESS, {
        listId,
        itemId,
        comment: json
      });
    })
    .catch(() => {
      dispatch(addCommentFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.add-comment-fail',
        data: text
      });
    });

export const fetchComments = (itemName, listId, itemId) => dispatch =>
  getData(`/api/comments/${listId}/${itemId}/data`)
    .then(resp => resp.json())
    .then(json => {
      const comments = _keyBy(json, '_id');
      dispatch(fetchCommentsSuccess(listId, itemId, comments));
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
      dispatch(archiveItemSuccess(listId, itemId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.archive-item',
        data: name
      });
      socket.emit(ItemActionTypes.ARCHIVE_SUCCESS, { listId, itemId });
    })
    .catch(() => {
      dispatch(archiveItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.archive-item-fail',
        data: name
      });
    });

export const fetchArchivedItems = (listId, listName) => dispatch =>
  getData(`/api/lists/${listId}/archived-items`)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedItemsSuccess(listId, dataMap));
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
      dispatch(restoreItemSuccess(listId, itemId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.restore-item',
        data: name
      });
      socket.emit(ItemActionTypes.RESTORE_SUCCESS, { listId, itemId });
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
      dispatch(deleteItemSuccess(listId, itemId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.delete-item',
        data: name
      });
      socket.emit(ItemActionTypes.DELETE_SUCCESS, { listId, itemId });
    })
    .catch(() => {
      dispatch(deleteItemFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.items.actions.delete-item-fail',
        data: name
      });
    });

export const lockItem = (itemId, listId, lock) =>
  socket.emit(ItemStatusType.LOCK, { itemId, listId, lock });

export const unlockItem = (itemId, listId, lock) =>
  socket.emit(ItemStatusType.UNLOCK, { itemId, listId, lock });
