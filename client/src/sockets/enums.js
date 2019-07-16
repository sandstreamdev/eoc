import {
  ItemActionTypes,
  CommentActionTypes
} from 'modules/list/components/Items/model/actionTypes';
import { ListActionTypes } from 'modules/list/model/actionTypes';

export const ItemsEvents = Object.freeze({
  ADD_SUCCESS: ItemActionTypes.ADD_SUCCESS,
  ARCHIVE_SUCCESS: ItemActionTypes.ARCHIVE_SUCCESS,
  CLEAR_VOTE_SUCCESS: ItemActionTypes.CLEAR_VOTE_SUCCESS,
  CLONE_SUCCESS: ItemActionTypes.CLONE_SUCCESS,
  DELETE_SUCCESS: ItemActionTypes.DELETE_SUCCESS,
  RESTORE_SUCCESS: ItemActionTypes.RESTORE_SUCCESS,
  SET_VOTE_SUCCESS: ItemActionTypes.SET_VOTE_SUCCESS,
  TOGGLE_SUCCESS: ItemActionTypes.TOGGLE_SUCCESS,
  UPDATE_SUCCESS: ItemActionTypes.UPDATE_SUCCESS
});

export const ItemStatusType = Object.freeze({
  LOCK: 'item/LOCK',
  UNLOCK: 'item/UNLOCK'
});

export const ListEvents = Object.freeze({
  CREATE_SUCCESS: ListActionTypes.CREATE_SUCCESS
});

export const CohortEvent = Object.freeze({});

export const CommentEvents = Object.freeze({
  ADD_SUCCESS: CommentActionTypes.ADD_SUCCESS
});

export const ActivitiesEvents = Object.freeze({});
