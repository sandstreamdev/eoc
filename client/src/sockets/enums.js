import { ListActionTypes } from 'modules/list/model/actionTypes';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';

export const ListEvents = Object.freeze({
  ADD_MEMBER_ROLE_SUCCESS: ListActionTypes.ADD_MEMBER_ROLE_SUCCESS,
  ADD_OWNER_ROLE_SUCCESS: ListActionTypes.ADD_OWNER_ROLE_SUCCESS,
  ADD_VIEWER_SUCCESS: ListActionTypes.ADD_VIEWER_SUCCESS,
  CREATE_SUCCESS: ListActionTypes.CREATE_SUCCESS,
  FETCH_META_DATA_SUCCESS: ListActionTypes.FETCH_META_DATA_SUCCESS,
  REMOVE_MEMBER_ROLE_SUCCESS: ListActionTypes.REMOVE_MEMBER_ROLE_SUCCESS,
  REMOVE_OWNER_ROLE_SUCCESS: ListActionTypes.REMOVE_OWNER_ROLE_SUCCESS
});

export const CohortEvents = Object.freeze({
  ADD_MEMBER_SUCCESS: CohortActionTypes.ADD_MEMBER_SUCCESS,
  ADD_OWNER_ROLE_SUCCESS: CohortActionTypes.ADD_OWNER_ROLE_SUCCESS,
  REMOVE_OWNER_ROLE_SUCCESS: CohortActionTypes.REMOVE_OWNER_ROLE_SUCCESS,
  CREATE_SUCCESS: CohortActionTypes.CREATE_SUCCESS
});
