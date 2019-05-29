import _keyBy from 'lodash/keyBy';

import {
  deleteData,
  getData,
  patchData,
  postData
} from 'common/utils/fetchMethods';
import { ListActionTypes } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import history from 'common/utils/history';

const fetchListDataFailure = errMessage => ({
  type: ListActionTypes.FETCH_DATA_FAILURE,
  payload: errMessage
});
const fetchListDataSuccess = (data, listId) => ({
  type: ListActionTypes.FETCH_DATA_SUCCESS,
  payload: { data, listId }
});

const createListSuccess = data => ({
  type: ListActionTypes.CREATE_SUCCESS,
  payload: data
});

const createListFailure = errMessage => ({
  type: ListActionTypes.CREATE_FAILURE,
  payload: errMessage
});

const deleteListSuccess = id => ({
  type: ListActionTypes.DELETE_SUCCESS,
  payload: id
});

const deleteListFailure = errMessage => ({
  type: ListActionTypes.DELETE_FAILURE,
  payload: errMessage
});

const updateListSuccess = data => ({
  type: ListActionTypes.UPDATE_SUCCESS,
  payload: data
});

const updateListFailure = errMessage => ({
  type: ListActionTypes.UPDATE_FAILURE,
  payload: errMessage
});

const fetchListsMetaDataSuccess = data => ({
  type: ListActionTypes.FETCH_META_DATA_SUCCESS,
  payload: data
});

const fetchListsMetaDataFailure = errMessage => ({
  type: ListActionTypes.FETCH_META_DATA_FAILURE,
  payload: errMessage
});

const fetchArchivedListsMetaDataSuccess = data => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload: data
});

const fetchArchivedListsMetaDataFailure = errMessage => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE,
  payload: errMessage
});

const archiveListSuccess = data => ({
  type: ListActionTypes.ARCHIVE_SUCCESS,
  payload: data
});

const archiveListFailure = errMessage => ({
  type: ListActionTypes.ARCHIVE_FAILURE,
  payload: errMessage
});

const restoreListSuccess = (data, listId) => ({
  type: ListActionTypes.RESTORE_SUCCESS,
  payload: { data, listId }
});

const restoreListFailure = errMessage => ({
  type: ListActionTypes.RESTORE_FAILURE,
  payload: errMessage
});

export const removeArchivedListsMetaData = () => ({
  type: ListActionTypes.REMOVE_ARCHIVED_META_DATA
});

const favouritesSuccess = data => ({
  type: ListActionTypes.FAVOURITES_SUCCESS,
  payload: data
});

const favouritesFailure = () => ({
  type: ListActionTypes.FAVOURITES_FAILURE
});

const addViewerSuccess = (data, listId) => ({
  type: ListActionTypes.ADD_VIEWER_SUCCESS,
  payload: { listId, data }
});

const addViewerFailure = () => ({
  type: ListActionTypes.ADD_VIEWER_FAILURE
});

const removeMemberFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_FAILURE
});

const removeMemberSuccess = (listId, userId) => ({
  type: ListActionTypes.REMOVE_MEMBER_SUCCESS,
  payload: { listId, userId }
});

const addOwnerRoleSuccess = (listId, userId) => ({
  type: ListActionTypes.ADD_OWNER_ROLE_SUCCESS,
  payload: { listId, userId }
});

const addOwnerRoleFailure = () => ({
  type: ListActionTypes.ADD_OWNER_ROLE_FAILURE
});

const removeOwnerRoleSuccess = (listId, userId, isCurrentUserRoleChanging) => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS,
  payload: { isCurrentUserRoleChanging, listId, userId }
});

const removeOwnerRoleFailure = () => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_FAILURE
});

const addMemberRoleSuccess = (listId, userId) => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_SUCCESS,
  payload: { listId, userId }
});

const addMemberRoleFailure = () => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_FAILURE
});

const removeMemberRoleSuccess = (
  listId,
  userId,
  isCurrentUserRoleChanging
) => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS,
  payload: { listId, userId, isCurrentUserRoleChanging }
});

const removeMemberRoleFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_FAILURE
});

const changeTypeSuccess = (listId, data) => ({
  type: ListActionTypes.CHANGE_TYPE_SUCCESS,
  payload: { listId, data }
});

const changeTypeFailure = () => ({
  type: ListActionTypes.CHANGE_TYPE_FAILURE
});

export const fetchListData = listId => dispatch =>
  getData(`/api/lists/${listId}/data`)
    .then(resp => resp.json())
    .then(json => {
      const listData = { ...json, items: _keyBy(json.items, '_id') };
      dispatch(fetchListDataSuccess(listData, listId));
    })
    .catch(() => {
      dispatch(fetchListDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        'Fetching data failed. Please try again.'
      );
    });

export const createList = data => dispatch =>
  postData('/api/lists/create', data)
    .then(resp => resp.json())
    .then(json => {
      dispatch(createListSuccess(json));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Sack "${data.name}" successfully created. `
      );
    })
    .catch(() => {
      dispatch(createListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Creating sack "${data.name}" failed. Please try again.`
      );
    });

export const fetchListsMetaData = (cohortId = null) => dispatch => {
  const url = cohortId
    ? `/api/lists/meta-data/${cohortId}`
    : '/api/lists/meta-data';

  return getData(url)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchListsMetaDataSuccess(dataMap));
    })
    .catch(() => {
      dispatch(fetchListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        'Fetching sacks failed. Please try again.'
      );
    });
};

export const fetchArchivedListsMetaData = (cohortId = null) => dispatch => {
  const url = cohortId
    ? `/api/lists/archived/${cohortId}`
    : '/api/lists/archived';

  return getData(url)
    .then(resp => resp.json())
    .then(json => {
      const dataMap = _keyBy(json, '_id');
      dispatch(fetchArchivedListsMetaDataSuccess(dataMap));
    })
    .catch(() => {
      dispatch(fetchArchivedListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        'Fetching archived sacks failed. Please try again.'
      );
    });
};

export const deleteList = (id, listName) => dispatch =>
  deleteData(`/api/lists/${id}/delete`)
    .then(() => {
      dispatch(deleteListSuccess(id));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Sack: "${listName}" successfully deleted.`
      );
      history.replace('/dashboard');
    })
    .catch(() => {
      dispatch(deleteListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Deleting sack: "${listName}" failed. Please try again.`
      );
      throw new Error();
    });

export const updateList = (listId, data, listName) => dispatch =>
  patchData(`/api/lists/${listId}/update`, data)
    .then(() => {
      dispatch(updateListSuccess({ ...data, listId }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Sack: "${listName}" successfully updated.`
      );
    })
    .catch(() => {
      dispatch(updateListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Updating sack: "${listName}" failed. Please try again.`
      );
    });

export const archiveList = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/update`, {
    isArchived: true
  })
    .then(() => {
      dispatch(archiveListSuccess({ isArchived: true, listId }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Sack: "${listName}" was successfully archived!`
      );
    })
    .catch(err => {
      dispatch(archiveListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Archiving sack: "${listName}" failed. Please try again.`
      );
    });

export const restoreList = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/update`, {
    isArchived: false
  })
    .then(() => getData(`/api/lists/${listId}/data`))
    .then(resp => resp.json())
    .then(json => {
      dispatch(restoreListSuccess(json, listId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Sack "${listName}" was successfully restored!`
      );
    })
    .catch(() => {
      dispatch(restoreListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Restoring sack: "${listName}" failed. Please try again.`
      );
    });

export const addListToFavourites = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/add-to-fav`)
    .then(() => {
      dispatch(favouritesSuccess({ listId, isFavourite: true }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `Sack: "${listName}" marked as favourite.`
      );
    })
    .catch(err => {
      dispatch(favouritesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        `Failed to mark sack: ${listName} as favourite. Please try again.`
      );
    });

export const removeListFromFavourites = listId => dispatch =>
  patchData(`/api/lists/${listId}/remove-from-fav`)
    .then(resp => resp.json())
    .then(json => {
      dispatch(favouritesSuccess({ listId, isFavourite: false }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(favouritesFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const addListViewer = (listId, email) => dispatch =>
  patchData(`/api/lists/${listId}/add-viewer`, {
    email
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addViewerSuccess(json, listId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message || `"${json.displayName}" added as viewer successfully.`
      );
    })
    .catch(err => {
      dispatch(addViewerFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, adding new viewer failed..."
      );
    });

export const removeListMember = (
  listId,
  userName,
  userId,
  isOwner
) => dispatch => {
  const url = isOwner
    ? `/api/lists/${listId}/remove-owner`
    : `/api/lists/${listId}/remove-member`;

  return patchData(url, { userId })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeMemberSuccess(listId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `"${userName}" successfully removed.`
      );
    })
    .catch(err => {
      dispatch(removeMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};

export const addOwnerRole = (listId, userId, userName) => dispatch =>
  patchData(`/api/lists/${listId}/add-owner-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addOwnerRoleSuccess(listId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `"${userName}" has member role.`
      );
    })
    .catch(err => {
      dispatch(addOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const removeOwnerRole = (
  listId,
  userId,
  userName,
  isCurrentUserRoleChanging
) => dispatch =>
  patchData(`/api/lists/${listId}/remove-owner-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(
        removeOwnerRoleSuccess(listId, userId, isCurrentUserRoleChanging)
      );
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `"${userName}" has no owner role.`
      );
    })
    .catch(err => {
      dispatch(removeOwnerRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const addMemberRole = (
  listId,
  userId,
  userName,
  isCurrentUserAnOwner
) => dispatch =>
  patchData(`/api/lists/${listId}/add-member-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addMemberRoleSuccess(listId, userId, isCurrentUserAnOwner));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `"${userName}" has member role.`
      );
    })
    .catch(err => {
      dispatch(addMemberRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const removeMemberRole = (
  listId,
  userId,
  userName,
  isCurrentUserAnOwner
) => dispatch =>
  patchData(`/api/lists/${listId}/remove-member-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(removeMemberRoleSuccess(listId, userId, isCurrentUserAnOwner));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        `"${userName}" has no member role.`
      );
    })
    .catch(err => {
      dispatch(removeMemberRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });

export const changeType = (listId, type) => dispatch =>
  patchData(`/api/lists/${listId}/change-type`, {
    type
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(changeTypeSuccess(listId, json.data));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(changeTypeFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
