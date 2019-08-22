import _upperFirst from 'lodash/upperFirst';

import socket from 'sockets';
import { ListActionTypes } from 'modules/list/model/actionTypes';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';
import { Routes } from 'common/constants/enums';

const clearListMetaDataSuccess = () => ({
  type: ListActionTypes.CLEAR_META_DATA_SUCCESS
});

const clearCohortMetaDataSuccess = () => ({
  type: CohortActionTypes.CLEAR_META_DATA_SUCCESS
});

export const enterView = (route, userId) => dispatch => {
  const view = _upperFirst(route);

  socket.emit(`enter${view}View`, userId);
};

export const leaveView = (route, userId) => dispatch => {
  const view = _upperFirst(route);

  switch (view) {
    case _upperFirst(Routes.DASHBOARD): {
      dispatch(clearListMetaDataSuccess());
      break;
    }
    case _upperFirst(Routes.COHORTS):
      dispatch(clearCohortMetaDataSuccess());
      break;
    default:
      break;
  }

  socket.emit(`leave${view}View`, userId);
};

export const joinRoom = (route, id, userId) => dispatch => {
  const room = _upperFirst(route);
  const data = { room: `${route}-${id}`, userId, viewId: id };

  socket.emit(`join${room}Room`, data);
};

export const leaveRoom = (route, id, userId) => dispatch => {
  const room = _upperFirst(route);
  const data = { room: `${route}-${id}`, userId, viewId: id };

  socket.emit(`leave${room}Room`, data);

  if (room === _upperFirst(Routes.COHORT)) {
    dispatch(clearListMetaDataSuccess());
  }
};
