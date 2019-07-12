import { ListActionTypes } from 'modules/list/model/actionTypes';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';

export const LIST_EVENTS = Object.freeze({
  ADD_VIEWER_SUCCESS: ListActionTypes.ADD_VIEWER_SUCCESS,
  FETCH_META_DATA_SUCCESS: ListActionTypes.FETCH_META_DATA_SUCCESS
});

export const COHORT_EVENTS = Object.freeze({
  ADD_MEMBER_SUCCESS: CohortActionTypes.ADD_MEMBER_SUCCESS,
  CREATE_SUCCESS: CohortActionTypes.CREATE_SUCCESS
});
