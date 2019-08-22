import _upperFirst from 'lodash/upperFirst';

import socket from 'sockets';
import { ListActionTypes } from 'modules/list/model/actionTypes';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';

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
    case 'Dashboard': {
      dispatch(clearListMetaDataSuccess());
      break;
    }
    case 'Cohorts':
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

  if (room === 'Cohort') {
    dispatch(clearListMetaDataSuccess());
  }
};
