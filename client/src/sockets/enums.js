import {
  ItemActionTypes,
  CommentActionTypes
} from 'modules/list/components/Items/model/actionTypes';

export const ItemsEvents = Object.freeze({
  ADD_SUCCESS: ItemActionTypes.ADD_SUCCESS,
  ARCHIVE_SUCCESS: ItemActionTypes.ARCHIVE_SUCCESS,
  CLEAR_VOTE_SUCCESS: ItemActionTypes.CLEAR_VOTE_SUCCESS,
  CLONE_SUCCESS: ItemActionTypes.CLONE_SUCCESS,
  DELETE_SUCCESS: ItemActionTypes.DELETE_SUCCESS,
  RESTORE_SUCCESS: ItemActionTypes.RESTORE_SUCCESS,
  SET_VOTE_SUCCESS: ItemActionTypes.SET_VOTE_SUCCESS,
  UPDATE_SUCCESS: ItemActionTypes.UPDATE_SUCCESS
});

export const ItemStatusType = Object.freeze({
  BUSY: 'item/BUSY',
  FREE: 'item/FREE'
});

export const ListEvents = Object.freeze({});

export const CohortEvent = Object.freeze({});

export const CommentEvents = Object.freeze({
  ADD_SUCCESS: CommentActionTypes.ADD_SUCCESS
});

export const ActivitiesEvents = Object.freeze({});
