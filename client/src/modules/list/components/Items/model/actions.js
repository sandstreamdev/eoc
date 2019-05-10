import { ENDPOINT_URL } from 'common/constants/variables';
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
const addItemRequest = () => ({
  type: ItemActionTypes.ADD_REQUEST
});

const toggleItemSuccess = (item, itemId, listId) => ({
  type: ItemActionTypes.TOGGLE_SUCCESS,
  payload: { item, itemId, listId }
});
const toggleItemRequest = () => ({
  type: ItemActionTypes.TOGGLE_REQUEST
});
const toggleItemFailure = errMessage => ({
  type: ItemActionTypes.TOGGLE_FAILURE,
  payload: errMessage
});

const voteForItemSuccess = (item, itemId, listId) => ({
  type: ItemActionTypes.VOTE_SUCCESS,
  payload: { item, itemId, listId }
});
const voteForItemRequest = () => ({
  type: ItemActionTypes.VOTE_REQUEST
});
const voteForItemFailure = errMessage => ({
  type: ItemActionTypes.VOTE_FAILURE,
  payload: errMessage
});

const updateItemDetailsSuccess = (listId, itemId, data) => ({
  type: ItemActionTypes.UPDATE_DETAILS_SUCCESS,
  payload: { listId, itemId, data }
});

const updateItemDetailsRequest = () => ({
  type: ItemActionTypes.UPDATE_DETAILS_REQUEST
});

const updateItemDetailsFailure = () => ({
  type: ItemActionTypes.UPDATE_DETAILS_FAILURE
});

const cloneItemSuccess = (listId, item) => ({
  type: ItemActionTypes.CLONE_SUCCESS,
  payload: { listId, item }
});

const cloneItemRequest = () => ({
  type: ItemActionTypes.CLONE_REQUEST
});

const cloneItemFailure = () => ({
  type: ItemActionTypes.CLONE_FAILURE
});

const addCommentSuccess = (listId, itemId, comment) => ({
  type: CommentActionTypes.ADD_SUCCESS,
  payload: { comment, itemId, listId }
});

const addCommentRequest = () => ({
  type: CommentActionTypes.ADD_REQUEST
});

const addCommentFailure = () => ({
  type: CommentActionTypes.ADD_FAILURE
});

const fetchCommentsSuccess = (listId, itemId, comments) => ({
  type: CommentActionTypes.FETCH_SUCCESS,
  payload: { comments, itemId, listId }
});

const fetchCommentsRequest = () => ({
  type: CommentActionTypes.FETCH_REQUEST
});

const fetchCommentsFailure = () => ({
  type: CommentActionTypes.FETCH_FAILURE
});

export const addItem = (item, listId) => dispatch => {
  dispatch(addItemRequest());
  return postData(`${ENDPOINT_URL}/lists/add-item`, { item, listId })
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
};

export const toggle = (
  isOrdered,
  itemId,
  listId,
  updatedAuthor
) => dispatch => {
  dispatch(toggleItemRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update-item-details`, {
    itemId,
    isOrdered: !isOrdered
  })
    .then(resp => resp.json())
    .then(item =>
      setTimeout(() => dispatch(toggleItemSuccess(item, itemId, listId)), 600)
    )
    .catch(err => {
      dispatch(toggleItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, changing item's status failed..."
      );
    });
};

export const setVote = (itemId, listId) => dispatch => {
  dispatch(voteForItemRequest());

  return patchData(`${ENDPOINT_URL}/lists/${listId}/set-vote`, { itemId })
    .then(resp => resp.json())
    .then(item => dispatch(voteForItemSuccess(item, itemId, listId)))
    .catch(err => {
      dispatch(voteForItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, voting failed...."
      );
    });
};

export const clearVote = (itemId, listId) => dispatch => {
  dispatch(voteForItemRequest());

  return patchData(`${ENDPOINT_URL}/lists/${listId}/clear-vote`, { itemId })
    .then(resp => resp.json())
    .then(item => dispatch(voteForItemSuccess(item, itemId, listId)))
    .catch(err => {
      dispatch(voteForItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, voting failed...."
      );
    });
};

export const updateItemDetails = (listId, itemId, data) => dispatch => {
  dispatch(updateItemDetailsRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update-item-details`, {
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
};

export const cloneItem = (listId, itemId) => dispatch => {
  dispatch(cloneItemRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/clone-item`, {
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
};

export const addComment = (listId, itemId, text) => dispatch => {
  dispatch(addCommentRequest());
  return postData(`${ENDPOINT_URL}/comments/add-comment`, {
    itemId,
    listId,
    text
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addCommentSuccess(listId, itemId, json));
    })
    .catch(err => {
      dispatch(addCommentFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const fetchComments = (listId, itemId) => dispatch => {
  dispatch(fetchCommentsRequest());
  return getData(`${ENDPOINT_URL}/comments/${listId}/${itemId}/data`)
    .then(resp => resp.json())
    .then(json => {
      dispatch(fetchCommentsSuccess(listId, itemId, json));
    })
    .catch(err => {
      dispatch(fetchCommentsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};
