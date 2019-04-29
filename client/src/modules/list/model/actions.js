import _keyBy from 'lodash/keyBy';

import { ENDPOINT_URL } from 'common/constants/variables';
import {
  deleteData,
  getData,
  patchData,
  postData
} from 'common/utils/fetchMethods';
import { ListActionTypes } from './actionTypes';
import {
  MessageType as NotificationType,
  UserRoles
} from 'common/constants/enums';
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

const fetchListDataRequest = () => ({
  type: ListActionTypes.FETCH_DATA_REQUEST
});

const createListSuccess = data => ({
  type: ListActionTypes.CREATE_SUCCESS,
  payload: data
});

const createListFailure = errMessage => ({
  type: ListActionTypes.CREATE_FAILURE,
  payload: errMessage
});

const createListRequest = () => ({
  type: ListActionTypes.CREATE_REQUEST
});

const deleteListSuccess = id => ({
  type: ListActionTypes.DELETE_SUCCESS,
  payload: id
});

const deleteListFailure = errMessage => ({
  type: ListActionTypes.DELETE_FAILURE,
  payload: errMessage
});

const deleteListRequest = () => ({
  type: ListActionTypes.DELETE_REQUEST
});

const updateListSuccess = data => ({
  type: ListActionTypes.UPDATE_SUCCESS,
  payload: data
});

const updateListFailure = errMessage => ({
  type: ListActionTypes.UPDATE_FAILURE,
  payload: errMessage
});

const updateListRequest = () => ({
  type: ListActionTypes.UPDATE_REQUEST
});

const fetchListsMetaDataSuccess = data => ({
  type: ListActionTypes.FETCH_META_DATA_SUCCESS,
  payload: data
});
const fetchListsMetaDataFailure = errMessage => ({
  type: ListActionTypes.FETCH_META_DATA_FAILURE,
  payload: errMessage
});
const fetchListsMetaDataRequest = () => ({
  type: ListActionTypes.FETCH_META_DATA_REQUEST
});

const fetchArchivedListsMetaDataSuccess = data => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_SUCCESS,
  payload: data
});
const fetchArchivedListsMetaDataFailure = errMessage => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_FAILURE,
  payload: errMessage
});
const fetchArchivedListsMetaDataRequest = () => ({
  type: ListActionTypes.FETCH_ARCHIVED_META_DATA_REQUEST
});

const archiveListSuccess = data => ({
  type: ListActionTypes.ARCHIVE_SUCCESS,
  payload: data
});
const archiveListFailure = errMessage => ({
  type: ListActionTypes.ARCHIVE_FAILURE,
  payload: errMessage
});
const archiveListRequest = () => ({
  type: ListActionTypes.ARCHIVE_REQUEST
});

const restoreListSuccess = (data, listId) => ({
  type: ListActionTypes.RESTORE_SUCCESS,
  payload: { data, listId }
});
const restoreListFailure = errMessage => ({
  type: ListActionTypes.RESTORE_FAILURE,
  payload: errMessage
});
const restoreListRequest = () => ({
  type: ListActionTypes.RESTORE_REQUEST
});

export const removeArchivedListsMetaData = () => ({
  type: ListActionTypes.REMOVE_ARCHIVED_META_DATA
});

const favouritesRequest = () => ({
  type: ListActionTypes.FAVOURITES_REQUEST
});

const favouritesSuccess = data => ({
  type: ListActionTypes.FAVOURITES_SUCCESS,
  payload: data
});

const favouritesFailure = () => ({
  type: ListActionTypes.FAVOURITES_FAILURE
});

const addMemberRequest = () => ({
  type: ListActionTypes.ADD_MEMBER_REQUEST
});

const addMemberSuccess = (data, listId) => ({
  type: ListActionTypes.ADD_MEMBER_SUCCESS,
  payload: { listId, data }
});

const addMemberFailure = () => ({
  type: ListActionTypes.ADD_MEMBER_FAILURE
});

const removeMemberRequest = () => ({
  type: ListActionTypes.REMOVE_MEMBER_REQUEST
});

const removeMemberFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_FAILURE
});

const removeMemberSuccess = (listId, userId) => ({
  type: ListActionTypes.REMOVE_MEMBER_SUCCESS,
  payload: { listId, userId }
});

const changeRoleRequest = () => ({
  type: ListActionTypes.CHANGE_ROLE_REQUEST
});

const changeRoleFailure = () => ({
  type: ListActionTypes.CHANGE_ROLE_FAILURE
});

const changeRoleSuccess = (listId, userId, isOwner) => ({
  type: ListActionTypes.CHANGE_ROLE_SUCCESS,
  payload: { listId, userId, isOwner }
});

export const fetchListData = listId => dispatch => {
  dispatch(fetchListDataRequest());
  return getData(`${ENDPOINT_URL}/lists/${listId}/data`)
    .then(resp => resp.json())
    .then(json => dispatch(fetchListDataSuccess(json, listId)))
    .catch(err => {
      dispatch(fetchListDataFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, fetching data failed..."
      );
    });
};

export const createList = data => dispatch => {
  dispatch(createListRequest());
  return postData(`${ENDPOINT_URL}/lists/create`, data)
    .then(resp => resp.json())
    .then(json => dispatch(createListSuccess(json)))
    .catch(err => {
      dispatch(createListFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, creating new list failed..."
      );
    });
};

export const fetchListsMetaData = (cohortId = null) => dispatch => {
  const url = cohortId
    ? `${ENDPOINT_URL}/lists/meta-data/${cohortId}`
    : `${ENDPOINT_URL}/lists/meta-data`;
  dispatch(fetchListsMetaDataRequest());
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
    ? `${ENDPOINT_URL}/lists/archived/${cohortId}`
    : `${ENDPOINT_URL}/lists/archived`;
  dispatch(fetchArchivedListsMetaDataRequest());
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

export const deleteList = id => dispatch => {
  dispatch(deleteListRequest());
  return deleteData(`${ENDPOINT_URL}/lists/${id}/delete`)
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
};

export const updateList = (listId, data) => dispatch => {
  dispatch(updateListRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update`, data)
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
};

export const archiveList = listId => dispatch => {
  dispatch(archiveListRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update`, {
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
};

export const restoreList = listId => dispatch => {
  dispatch(restoreListRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update`, {
    isArchived: false
  })
    .then(() => getData(`${ENDPOINT_URL}/lists/${listId}/data`))
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
};

export const addListToFavourites = listId => dispatch => {
  dispatch(favouritesRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/add-to-fav`)
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
};

export const removeListFromFavourites = listId => dispatch => {
  dispatch(favouritesRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/remove-from-fav`)
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
};

export const addListMember = (listId, email) => dispatch => {
  dispatch(addMemberRequest());
  return patchData(`${ENDPOINT_URL}/lists/${listId}/add-member`, {
    email
  })
    .then(resp => resp.json())
    .then(json => dispatch(addMemberSuccess(json, listId)))
    .catch(err => {
      dispatch(addMemberFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, adding new member failed..."
      );
    });
};

export const removeListMember = (listId, userId, isOwner) => dispatch => {
  const url = isOwner
    ? `${ENDPOINT_URL}/lists/${listId}/remove-owner`
    : `${ENDPOINT_URL}/lists/${listId}/remove-member`;
  dispatch(removeMemberRequest());
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

export const changeRole = (listId, userId, role) => dispatch => {
  const isOwner = role === UserRoles.OWNER;
  const url = isOwner
    ? `${ENDPOINT_URL}/lists/${listId}/change-to-owner`
    : `${ENDPOINT_URL}/lists/${listId}/change-to-member`;
  dispatch(changeRoleRequest());
  return patchData(url, { userId })
    .then(resp => resp.json())
    .then(json => {
      dispatch(changeRoleSuccess(listId, userId, isOwner));
      createNotificationWithTimeout(
        dispatch,
        NotificationType.SUCCESS,
        json.message
      );
    })
    .catch(err => {
      dispatch(changeRoleFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message
      );
    });
};
