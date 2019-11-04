import _keyBy from 'lodash/keyBy';

import {
  deleteData,
  getJson,
  patchData,
  postData
} from 'common/utils/fetchMethods';
import {
  CommentActionTypes,
  ItemActionTypes,
  ItemStatusType
} from 'modules/list/components/Items/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import socket from 'sockets';

const addItemFailure = () => ({
  type: ItemActionTypes.ADD_FAILURE
});

export const addItemSuccess = payload => ({
  type: ItemActionTypes.ADD_SUCCESS,
  payload
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

const moveItemToListSuccess = payload => ({
  type: ItemActionTypes.MOVE_SUCCESS,
  payload
});

const moveItemToListFailure = () => ({
  type: ItemActionTypes.MOVE_FAILURE
});

export const removeArchivedItems = payload => ({
  type: ItemActionTypes.REMOVE_ARCHIVED,
  payload
});

const markAsDoneSuccess = payload => ({
  type: ItemActionTypes.MARK_AS_DONE_SUCCESS,
  payload
});

const markAsDoneFailure = () => ({
  type: ItemActionTypes.MARK_AS_DONE_FAILURE
});

const markAsUnhandledSuccess = payload => ({
  type: ItemActionTypes.MARK_AS_UNHANDLED_SUCCESS,
  payload
});

const markAsUnhandledFailure = () => ({
  type: ItemActionTypes.MARK_AS_UNHANDLED_FAILURE
});

const disableItemAnimationsSuccess = payload => ({
  type: ItemActionTypes.DISABLE_ANIMATIONS_SUCCESS,
  payload
});

export const disableItemAnimations = (itemId, listId) => dispatch =>
  dispatch(disableItemAnimationsSuccess({ itemId, listId }));

export const addItem = (item, listId) => dispatch =>
  postData('/api/lists/add-item', { item, listId })
    .then(response => response.json())
    .then(json => dispatch(addItemSuccess({ item: json, listId })))
    .catch(err => {
      const { name } = item;
      dispatch(addItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.add-item-fail',
          data: { name }
        },
        err
      );
    });

export const setVote = (itemId, listId, name) => dispatch =>
  patchData(`/api/lists/${listId}/set-vote`, { itemId })
    .then(() => dispatch(setVoteSuccess({ itemId, listId, isVoted: true })))
    .catch(err => {
      dispatch(setVoteFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.set-vote-fail',
          data: { name }
        },
        err
      );
    });

export const clearVote = (itemId, listId, name) => dispatch =>
  patchData(`/api/lists/${listId}/clear-vote`, { itemId })
    .then(() => dispatch(clearVoteSuccess({ itemId, listId, isVoted: false })))
    .catch(err => {
      dispatch(clearVoteFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.clear-vote-fail',
          data: { name }
        },
        err
      );
    });

export const updateListItem = (
  name,
  listId,
  itemId,
  userData,
  data
) => dispatch => {
  const { editedBy } = userData;

  return patchData(`/api/lists/${listId}/update-item`, {
    ...data,
    itemId
  })
    .then(() => {
      dispatch(
        updateListItemSuccess({
          listId,
          itemId,
          updatedData: {
            ...data,
            editedBy
          }
        })
      );

      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.update-item',
        data: { name }
      });
    })
    .catch(err => {
      dispatch(updateListItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.update-item-fail',
          data: { name }
        },
        err
      );
    });
};

export const cloneItem = (name, listId, itemId) => dispatch =>
  patchData(`/api/lists/${listId}/clone-item`, {
    itemId
  })
    .then(response => response.json())
    .then(json => {
      dispatch(cloneItemSuccess({ item: json, listId }));

      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.clone-item',
        data: { name }
      });
    })
    .catch(err => {
      dispatch(cloneItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.clone-item-fail',
          data: { name }
        },
        err
      );
    });

export const addComment = (listId, itemId, text) => dispatch =>
  postData('/api/comments/add-comment', {
    itemId,
    listId,
    text
  })
    .then(response => response.json())
    .then(json =>
      dispatch(addCommentSuccess({ listId, itemId, comment: json }))
    )
    .catch(err => {
      dispatch(addCommentFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.add-comment-fail',
          data: { text }
        },
        err
      );
    });

export const fetchComments = (name, listId, itemId) => dispatch =>
  getJson(`/api/comments/${listId}/${itemId}/data`)
    .then(json => {
      const comments = _keyBy(json, '_id');
      dispatch(fetchCommentsSuccess({ listId, itemId, comments }));
    })
    .catch(err => {
      dispatch(fetchCommentsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.fetch-comments-fails',
          data: { name }
        },
        err
      );
    });

export const markAsDone = (listId, itemId, name, editedBy) => dispatch =>
  patchData(`/api/lists/${listId}/mark-item-as-done`, {
    itemId
  })
    .then(() => {
      dispatch(markAsDoneSuccess({ listId, itemId, editedBy }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.mark-item-as-done',
        data: { name }
      });

      throw new Error();
    })
    .catch(err => {
      dispatch(markAsDoneFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.mark-item-as-done-fail',
          data: { name }
        },
        err
      );
    });

export const markAsUnhandled = (listId, itemId, name, editedBy) => dispatch =>
  patchData(`/api/lists/${listId}/mark-item-as-unhandled`, {
    itemId
  })
    .then(() => {
      dispatch(markAsUnhandledSuccess({ listId, itemId, editedBy }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.mark-item-as-unhandled',
        data: { name }
      });
    })
    .catch(err => {
      dispatch(markAsUnhandledFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.mark-item-as-unhandled-fail',
          data: { name }
        },
        err
      );
    });

export const archiveItem = (listId, itemId, name, editedBy) => dispatch =>
  patchData(`/api/lists/${listId}/archive-item`, {
    itemId
  })
    .then(() => {
      dispatch(archiveItemSuccess({ listId, itemId, editedBy }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.archive-item',
        data: { name }
      });
    })
    .catch(err => {
      dispatch(archiveItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.archive-item-fail',
          data: { name }
        },
        err
      );
    });

export const fetchArchivedItems = (listId, name) => dispatch =>
  getJson(`/api/lists/${listId}/archived-items`)
    .then(json => {
      const data = _keyBy(json, '_id');
      dispatch(fetchArchivedItemsSuccess({ listId, data }));
    })
    .catch(err => {
      dispatch(fetchArchivedItemsFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.fetch-archived',
          data: { name }
        },
        err
      );
    });

export const restoreItem = (listId, itemId, name, editedBy, done) => dispatch =>
  patchData(`/api/lists/${listId}/restore-item`, {
    itemId
  })
    .then(() => {
      dispatch(
        restoreItemSuccess({ listId, itemId, item: { done, editedBy } })
      );
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.restore-item',
        data: { name }
      });
    })
    .catch(err => {
      dispatch(restoreItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.action.restore-item-fail',
          data: { name }
        },
        err
      );
    });

export const deleteItem = (listId, itemId, name) => dispatch =>
  deleteData(`/api/lists/${listId}/${itemId}`)
    .then(() => {
      dispatch(deleteItemSuccess({ listId, itemId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.delete-item',
        data: { name }
      });
    })
    .catch(err => {
      dispatch(deleteItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.actions.delete-item-fail',
          data: { name }
        },
        err
      );
    });

export const moveItemToList = (itemId, listId, newListId, data) => dispatch =>
  patchData(`/api/lists/${listId}/move-item`, { itemId, newListId })
    .then(() => {
      dispatch(moveItemToListSuccess({ listId, itemId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.items.actions.move-item',
        data
      });
    })
    .catch(err => {
      dispatch(moveItemToListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        {
          notificationId: 'list.items.action.move-item-fail',
          data
        },
        err
      );
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
