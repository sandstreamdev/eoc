import _keyBy from 'lodash/keyBy';

import { getData, patchData, postData } from 'common/utils/fetchMethods';
import {
  CommentActionTypes,
  ItemActionTypes
} from 'modules/list/components/Items/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import { ITEM_TOGGLE_TIME } from '../ListItem/constants';

const addItemFailure = errorMessage => ({
  type: ItemActionTypes.ADD_FAILURE,
  payload: errorMessage
});

const addItemSuccess = (item, listId) => ({
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
  type: ItemActionTypes.UPDATE_DETAILS_SUCCESS,
  payload: { listId, itemId, data }
});

const updateListItemFailure = () => ({
  type: ItemActionTypes.UPDATE_DETAILS_FAILURE
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
    .then(json => dispatch(addItemSuccess(json, listId)))
    .catch(() => {
      dispatch(addItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to add: "${item.name}". Please try again.`
      );
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
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Item: "${itemName}" updated successfully.`
      );
    })
    .catch(() => {
      dispatch(toggleItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to update item: "${itemName}". Please try again.`
      );
    });

export const setVote = (itemId, listId, itemName) => dispatch =>
  patchData(`/api/lists/${listId}/set-vote`, { itemId })
    .then(() => dispatch(setVoteSuccess(itemId, listId)))
    .catch(() => {
      dispatch(setVoteFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to vote for: "${itemName}". Please try again.`
      );
    });

export const clearVote = (itemId, listId, itemName) => dispatch =>
  patchData(`/api/lists/${listId}/clear-vote`, { itemId })
    .then(() => dispatch(clearVoteSuccess(itemId, listId)))
    .catch(err => {
      dispatch(clearVoteFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to clear vote for item: "${itemName}". Please try again.`
      );
    });

export const updateListItem = (itemName, listId, itemId, data) => dispatch =>
  patchData(`/api/lists/${listId}/update-item`, {
    ...data,
    itemId
  })
    .then(() => {
      dispatch(updateListItemSuccess(listId, itemId, data));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Item: "${itemName}" updated successfully.`
      );
    })
    .catch(() => {
      dispatch(updateListItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to update "${itemName}" item. Please try again.`
      );
    });

export const cloneItem = (itemName, listId, itemId) => dispatch =>
  patchData(`/api/lists/${listId}/clone-item`, {
    itemId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(cloneItemSuccess(listId, json.item));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Successfully cloned item: "${itemName}".`
      );
    })
    .catch(err => {
      dispatch(cloneItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to clone item: "${itemName}". Please try again.`
      );
    });

export const addComment = (listId, itemId, text) => dispatch =>
  postData('/api/comments/add-comment', {
    itemId,
    listId,
    text
  })
    .then(resp => resp.json())
    .then(json => dispatch(addCommentSuccess(listId, itemId, json)))
    .catch(() => {
      dispatch(addCommentFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to add comment: "${text}". Please try again.`
      );
    });

export const fetchComments = (itemName, listId, itemId) => dispatch =>
  getData(`/api/comments/${listId}/${itemId}/data`)
    .then(resp => resp.json())
    .then(json => {
      const comments = _keyBy(json, '_id');
      dispatch(fetchCommentsSuccess(listId, itemId, comments));
    })
    .catch(err => {
      dispatch(fetchCommentsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to fetch comments for "${itemName}" item. Please try again.`
      );
    });

export const archiveItem = (listId, itemId, name) => dispatch =>
  patchData(`/api/lists/${listId}/update-item`, {
    isArchived: true,
    itemId
  })
    .then(() => {
      dispatch(archiveItemSuccess(listId, itemId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Item "${name}" successfully archived.`
      );
    })
    .catch(() => {
      dispatch(archiveItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to archive item: "${name}". Please try again.`
      );
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
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to fetch archived items of sack: "${listName}". Please try again.`
      );
    });

export const restoreItem = (listId, itemId, name) => dispatch =>
  patchData(`/api/lists/${listId}/update-item`, {
    isArchived: false,
    itemId
  })
    .then(() => {
      dispatch(restoreItemSuccess(listId, itemId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Item "${name}" successfully restored.`
      );
    })
    .catch(() => {
      dispatch(restoreItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to restore item: "${name}". Please try again.`
      );
    });

export const deleteItem = (listId, itemId, name) => dispatch =>
  patchData(`/api/lists/${listId}/delete-item/${itemId}`)
    .then(() => {
      dispatch(deleteItemSuccess(listId, itemId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Item "${name}" successfully deleted.`
      );
    })
    .catch(() => {
      dispatch(deleteItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to delete item: "${name}". Please try again.`
      );
    });
