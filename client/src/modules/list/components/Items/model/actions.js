import _keyBy from 'lodash/keyBy';

import { getData, patchData, postData } from 'common/utils/fetchMethods';
import {
  CommentActionTypes,
  ItemActionTypes
} from 'modules/list/components/Items/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

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

const updateItemDetailsSuccess = (listId, itemId, data) => ({
  type: ItemActionTypes.UPDATE_DETAILS_SUCCESS,
  payload: { listId, itemId, data }
});

const updateItemDetailsFailure = () => ({
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

export const addItem = (item, listId) => dispatch =>
  postData('/api/lists/add-item', { item, listId })
    .then(resp => resp.json())
    .then(json => dispatch(addItemSuccess(json, listId)))
    .catch(err => {
      dispatch(addItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, adding item failed..."
      );
    });

export const toggle = (
  isOrdered,
  itemId,
  listId,
  authorId,
  authorName
) => dispatch =>
  patchData(`/api/lists/${listId}/update-item-details`, {
    authorId,
    isOrdered: !isOrdered,
    itemId
  })
    .then(resp => resp.json())
    .then(json => {
      setTimeout(
        () => dispatch(toggleItemSuccess(authorId, authorName, itemId, listId)),
        600
      );
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message || 'Item details updated successfully.'
      );
    })
    .catch(err => {
      dispatch(toggleItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, changing item's status failed..."
      );
    });

export const setVote = (itemId, listId) => dispatch =>
  patchData(`/api/lists/${listId}/set-vote`, { itemId })
    .then(resp => resp.json())
    .then(json => dispatch(setVoteSuccess(itemId, listId)))
    .catch(err => {
      dispatch(setVoteFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, voting failed...."
      );
    });

export const clearVote = (itemId, listId) => dispatch =>
  patchData(`/api/lists/${listId}/clear-vote`, { itemId })
    .then(resp => resp.json())
    .then(json => dispatch(clearVoteSuccess(itemId, listId)))
    .catch(err => {
      dispatch(clearVoteFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, voting failed...."
      );
    });

export const updateItemDetails = (listId, itemId, data) => dispatch =>
  patchData(`/api/lists/${listId}/update-item-details`, {
    ...data,
    itemId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(updateItemDetailsSuccess(listId, itemId, data));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message || 'Item details updated successfully.'
      );
    })
    .catch(err => {
      dispatch(updateItemDetailsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const cloneItem = (listId, itemId) => dispatch =>
  patchData(`/api/lists/${listId}/clone-item`, {
    itemId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(cloneItemSuccess(listId, json.item));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(cloneItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
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
    .catch(err => {
      dispatch(addCommentFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const fetchComments = (listId, itemId) => dispatch =>
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
        err.message
      );
    });

export const archiveItem = (listId, itemId) => dispatch => {
  return patchData(`/api/lists/${listId}/update-item-details`, {
    isArchived: true,
    itemId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(archiveItemSuccess(listId, itemId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message || 'Item successfully archived.'
      );
    })
    .catch(err => {
      dispatch(archiveItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};
