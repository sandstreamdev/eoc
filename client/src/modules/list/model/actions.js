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
    .catch(err => {
      dispatch(fetchListDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching data failed..."
      );
    });

export const createList = data => dispatch =>
  postData('/api/lists/create', data)
    .then(resp => resp.json())
    .then(json => dispatch(createListSuccess(json)))
    .catch(() => {
      dispatch(createListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, creating new list failed..."
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
    .catch(err => {
      dispatch(fetchListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching lists failed..."
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
    .catch(err => {
      dispatch(fetchArchivedListsMetaDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching lists failed..."
      );
    });
};

export const deleteList = id => dispatch =>
  deleteData(`/api/lists/${id}/delete`)
    .then(resp =>
      resp.json().then(json => {
        dispatch(deleteListSuccess(id));
        createNotificationWithTimeout(
          dispatch,
          NotificationType.SUCCESS,
          json.message
        );
        history.replace('/dashboard');
      })
    )
    .catch(err => {
      dispatch(deleteListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, deleting list failed..."
      );
      throw new Error();
    });

export const updateList = (listId, data) => dispatch =>
  patchData(`/api/lists/${listId}/update`, data)
    .then(resp => resp.json())
    .then(json => {
      dispatch(updateListSuccess({ ...data, listId }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(updateListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, updating list failed..."
      );
    });

export const archiveList = listId => dispatch =>
  patchData(`/api/lists/${listId}/update`, {
    isArchived: true
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(archiveListSuccess({ isArchived: true, listId }));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        'List was successfully archived!' || json.message
      );
    })
    .catch(err => {
      dispatch(archiveListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, archiving list failed..."
      );
    });

export const restoreList = listId => dispatch =>
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
        'List was successfully restored!' || json.message
      );
    })
    .catch(err => {
      dispatch(restoreListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, restoring list failed..."
      );
    });

export const addListToFavourites = listId => dispatch =>
  patchData(`/api/lists/${listId}/add-to-fav`)
    .then(resp => resp.json())
    .then(json => {
      dispatch(favouritesSuccess({ listId, isFavourite: true }));
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
        json.message || 'Viewer added successfully.'
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

export const removeListMember = (listId, userId, isOwner) => dispatch => {
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
        json.message
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

export const addOwnerRole = (listId, userId) => dispatch =>
  patchData(`/api/lists/${listId}/add-owner-role`, {
    userId
  })
    .then(resp => resp.json())
    .then(json => {
      dispatch(addOwnerRoleSuccess(listId, userId));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
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
        json.message
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
        json.message
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
        json.message
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
