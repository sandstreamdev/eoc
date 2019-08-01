import _keyBy from 'lodash/keyBy';

import {
  deleteData,
  getData,
  patchData,
  postData
} from 'common/utils/fetchMethods';
import { ListActionTypes, ListHeaderStatusType } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';
import history from 'common/utils/history';
import { UserAddingStatus } from 'common/components/Members/const';
import { ResourceNotFoundException } from 'common/exceptions';
import socket from 'sockets';
import { ListType } from 'modules/list/consts';

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

const addViewerSuccess = data => ({
  type: ListActionTypes.ADD_VIEWER_SUCCESS,
  payload: data
});

const addViewerFailure = () => ({
  type: ListActionTypes.ADD_VIEWER_FAILURE
});

const removeMemberFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_FAILURE
});

const removeMemberSuccess = data => ({
  type: ListActionTypes.REMOVE_MEMBER_SUCCESS,
  payload: data
});

const addOwnerRoleSuccess = data => ({
  type: ListActionTypes.ADD_OWNER_ROLE_SUCCESS,
  payload: data
});

const addOwnerRoleFailure = () => ({
  type: ListActionTypes.ADD_OWNER_ROLE_FAILURE
});

const removeOwnerRoleSuccess = data => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS,
  payload: data
});

const removeOwnerRoleFailure = () => ({
  type: ListActionTypes.REMOVE_OWNER_ROLE_FAILURE
});

const addMemberRoleSuccess = data => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_SUCCESS,
  payload: data
});

const addMemberRoleFailure = () => ({
  type: ListActionTypes.ADD_MEMBER_ROLE_FAILURE
});

const removeMemberRoleSuccess = data => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS,
  payload: data
});

const removeMemberRoleFailure = () => ({
  type: ListActionTypes.REMOVE_MEMBER_ROLE_FAILURE
});

const changeTypeSuccess = data => ({
  type: ListActionTypes.CHANGE_TYPE_SUCCESS,
  payload: data
});

const changeTypeFailure = () => ({
  type: ListActionTypes.CHANGE_TYPE_FAILURE
});

const leaveListSuccess = listId => ({
  type: ListActionTypes.LEAVE_SUCCESS,
  payload: listId
});

const leaveListFailure = () => ({
  type: ListActionTypes.LEAVE_FAILURE
});

export const fetchListData = listId => dispatch =>
  getData(`/api/lists/${listId}/data`)
    .then(resp => resp.json())
    .then(json => {
      const listData = {
        ...json,
        items: _keyBy(json.items, '_id'),
        members: _keyBy(json.members, '_id')
      };
      dispatch(fetchListDataSuccess(listData, listId));
    })
    .catch(err => {
      if (!(err instanceof ResourceNotFoundException)) {
        dispatch(fetchListDataFailure());
        createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
          notificationId: 'list.actions.fetch-data-fail'
        });
      }

      throw err;
    });

export const createList = data => dispatch => {
  const { type } = data;

  return postData('/api/lists/create', data)
    .then(resp => resp.json())
    .then(json => {
      dispatch(createListSuccess(json));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.create-list',
        data: data.name
      });

      if (type === ListType.SHARED) {
        socket.emit(ListActionTypes.CREATE_SUCCESS, json);
      }
    })
    .catch(() => {
      dispatch(createListFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.create-list-fail',
        data: data.name
      });
    });
};

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
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.fetch-meta-data-fail'
      });
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
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.fetch-arch-meta-data-fail'
      });
    });
};

export const deleteList = (listId, listName, cohortId) => dispatch =>
  deleteData(`/api/lists/${listId}/delete`)
    .then(() => {
      dispatch(deleteListSuccess(listId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.delete-list',
        data: listName
      });
      history.replace(cohortId ? `/cohort/${cohortId}` : '/dashboard');
      socket.emit(ListActionTypes.DELETE_SUCCESS, { listId, cohortId });
    })
    .catch(() => {
      dispatch(deleteListFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.delete-list-fail',
        data: listName
      });
      throw new Error();
    });

export const updateList = (listId, data, listName) => dispatch =>
  patchData(`/api/lists/${listId}/update`, data)
    .then(() => {
      dispatch(updateListSuccess({ ...data, listId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.update-list',
        data: listName
      });
      socket.emit(ListActionTypes.UPDATE_SUCCESS, { ...data, listId });
    })
    .catch(() => {
      dispatch(updateListFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.update-list-fail',
        data: listName
      });
    });

export const archiveList = (listId, listName, cohortId) => dispatch =>
  patchData(`/api/lists/${listId}/update`, {
    isArchived: true
  })
    .then(() => {
      dispatch(archiveListSuccess({ isArchived: true, listId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.arch-list',
        data: listName
      });
      history.replace(cohortId ? `/cohort/${cohortId}` : '/dashboard');
      socket.emit(ListActionTypes.ARCHIVE_SUCCESS, { listId, cohortId });
    })
    .catch(() => {
      dispatch(archiveListFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.arch-list-fail',
        data: listName
      });
    });

export const restoreList = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/update`, {
    isArchived: false
  })
    .then(() => getData(`/api/lists/${listId}/data`))
    .then(resp => resp.json())
    .then(json => {
      const listData = {
        ...json,
        items: _keyBy(json.items, '_id'),
        members: _keyBy(json.members, '_id')
      };
      dispatch(restoreListSuccess(listData, listId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.restore-list',
        data: listName
      });
    })
    .catch(() => {
      dispatch(restoreListFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.restore-list-fail',
        data: listName
      });
    });

export const addListToFavourites = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/add-to-fav`)
    .then(() => {
      dispatch(favouritesSuccess({ listId, isFavourite: true }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.add-to-fav',
        data: listName
      });
    })
    .catch(() => {
      dispatch(favouritesFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.add-to-fav-fail',
        data: listName
      });
    });

export const removeListFromFavourites = (listId, listName) => dispatch =>
  patchData(`/api/lists/${listId}/remove-from-fav`)
    .then(() => {
      dispatch(favouritesSuccess({ listId, isFavourite: false }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.remove-from-fav',
        data: listName
      });
    })
    .catch(() => {
      dispatch(favouritesFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.remove-from-fav-fail',
        data: listName
      });
    });

export const addListViewer = (listId, email) => dispatch =>
  patchData(`/api/lists/${listId}/add-viewer`, {
    email
  })
    .then(resp => resp.json())
    .then(json => {
      if (json._id) {
        const data = { listId, viewer: json };

        socket.emit(ListActionTypes.ADD_VIEWER_SUCCESS, data);
        dispatch(addViewerSuccess(data));
        createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
          notificationId: 'list.actions.add-viewer',
          data: json.displayName
        });

        return UserAddingStatus.ADDED;
      }

      return UserAddingStatus.NO_USER;
    })
    .catch(err => {
      dispatch(addViewerFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: err.message || 'list.actions.add-viewer-default-fail',
        data: email
      });
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
    .then(() => {
      dispatch(removeMemberSuccess({ listId, userId }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.remove-member',
        data: userName
      });
      socket.emit(ListActionTypes.REMOVE_MEMBER_SUCCESS, { listId, userId });
    })
    .catch(() => {
      dispatch(removeMemberFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.remove-member-fail',
        data: userName
      });
    });
};

export const addOwnerRole = (listId, userId, userName) => dispatch =>
  patchData(`/api/lists/${listId}/add-owner-role`, {
    userId
  })
    .then(() => {
      socket.emit(ListActionTypes.ADD_OWNER_ROLE_SUCCESS, { listId, userId });
      dispatch(
        addOwnerRoleSuccess({
          isCurrentUserRoleChanging: false,
          listId,
          userId
        })
      );
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.owner-role',
        data: userName
      });
    })
    .catch(() => {
      dispatch(addOwnerRoleFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.add-owner-role-fail',
        data: userName
      });
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
    .then(() => {
      socket.emit(ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS, {
        listId,
        userId
      });
      dispatch(
        removeOwnerRoleSuccess({ listId, userId, isCurrentUserRoleChanging })
      );
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'common.no-owner-role',
        data: userName
      });
    })
    .catch(err => {
      dispatch(removeOwnerRoleFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: err.message || 'list.actions.remove-owner-role-fail',
        data: userName
      });
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
    .then(() => {
      socket.emit(ListActionTypes.ADD_MEMBER_ROLE_SUCCESS, {
        listId,
        userId
      });
      dispatch(addMemberRoleSuccess({ listId, userId, isCurrentUserAnOwner }));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.add-member-role',
        data: userName
      });
    })
    .catch(() => {
      dispatch(addMemberRoleFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.add-member-role-fail',
        data: userName
      });
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
    .then(() => {
      socket.emit(ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS, {
        listId,
        userId
      });
      dispatch(
        removeMemberRoleSuccess({ listId, userId, isCurrentUserAnOwner })
      );
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.remove-member-role',
        data: userName
      });
    })
    .catch(err => {
      dispatch(removeMemberRoleFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: err.message || 'list.actions.remove-member-role-fail',
        data: userName
      });
    });

export const changeType = (listId, listName, type) => dispatch =>
  patchData(`/api/lists/${listId}/change-type`, {
    type
  })
    .then(resp => resp.json())
    .then(json => {
      const listData = {
        ...json,
        members: _keyBy(json.members, '_id')
      };

      socket.emit(ListActionTypes.CHANGE_TYPE_SUCCESS, {
        listId,
        ...listData
      });
      dispatch(
        changeTypeSuccess({
          listId,
          ...listData
        })
      );
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.change-type',
        data: listName
      });
    })
    .catch(() => {
      dispatch(changeTypeFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: 'list.actions.change-type-fail',
        data: listName
      });
    });

export const leaveList = (
  listId,
  userId,
  cohortId,
  userName,
  type
) => dispatch =>
  patchData(`/api/lists/${listId}/leave`)
    .then(() => {
      socket.emit(ListActionTypes.LEAVE_SUCCESS, { listId, userId });
      dispatch(leaveListSuccess(listId));
      createNotificationWithTimeout(dispatch, NotificationType.SUCCESS, {
        notificationId: 'list.actions.leave',
        data: userName
      });
      history.replace(
        `/${
          cohortId && type === ListType.LIMITED
            ? `cohort/${cohortId}`
            : 'dashboard'
        }`
      );
    })
    .catch(err => {
      dispatch(leaveListFailure());
      createNotificationWithTimeout(dispatch, NotificationType.ERROR, {
        notificationId: err.message || 'list.actions.leave-fail',
        data: userName
      });
    });

export const lockListHeader = (listId, { nameLock, descriptionLock }) => {
  socket.emit(ListHeaderStatusType.LOCK, {
    descriptionLock,
    listId,
    nameLock
  });
};

export const unlockListHeader = (listId, { nameLock, descriptionLock }) => {
  socket.emit(ListHeaderStatusType.UNLOCK, {
    descriptionLock,
    listId,
    nameLock
  });
};
