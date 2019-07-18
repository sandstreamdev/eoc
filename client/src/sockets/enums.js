import {
  ListActionTypes,
  ListHeaderStatusType
} from 'modules/list/model/actionTypes';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';
import {
  ItemActionTypes,
  ItemStatusType,
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
  TOGGLE_SUCCESS: ItemActionTypes.TOGGLE_SUCCESS,
  UPDATE_SUCCESS: ItemActionTypes.UPDATE_SUCCESS
});

export const ListHeaderEvents = Object.freeze({
  LOCK: ListHeaderStatusType.LOCK,
  UNLOCK: ListHeaderStatusType.UNLOCK
});

export const ListEvents = Object.freeze({
  ADD_VIEWER_SUCCESS: ListActionTypes.ADD_VIEWER_SUCCESS,
  CREATE_SUCCESS: ListActionTypes.CREATE_SUCCESS,
  FETCH_META_DATA_SUCCESS: ListActionTypes.FETCH_META_DATA_SUCCESS,
  UPDATE_SUCCESS: ListActionTypes.UPDATE_SUCCESS
});

export const CohortEvents = Object.freeze({
  ADD_MEMBER_SUCCESS: CohortActionTypes.ADD_MEMBER_SUCCESS,
  CREATE_SUCCESS: CohortActionTypes.CREATE_SUCCESS,
  UPDATE_SUCCESS: CohortActionTypes.UPDATE_SUCCESS
});

export const CommentEvents = Object.freeze({
  ADD_SUCCESS: CommentActionTypes.ADD_SUCCESS
});

export { ItemStatusType };
