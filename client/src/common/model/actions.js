import _upperFirst from 'lodash/upperFirst';

import socket from 'sockets';
import { CommonActionTypes } from 'common/model/actionTypes';

const clearMetaDataSuccess = view => ({
  type: CommonActionTypes.LEAVE_VIEW,
  payload: view
});

export const enterView = (route, userId) => dispatch => {
  const view = _upperFirst(route);

  socket.emit('enterView', { userId, view });
};

export const leaveView = (route, userId) => dispatch => {
  const view = _upperFirst(route);

  dispatch(clearMetaDataSuccess(view));
  socket.emit('leaveView', { userId, view });
};

export const joinRoom = (route, id, userId) => dispatch => {
  const room = _upperFirst(route);
  const data = { roomId: `${route}-${id}`, userId, viewId: id };

  socket.emit('joinRoom', { data, room });
};

export const leaveRoom = (route, id, userId) => dispatch => {
  const room = _upperFirst(route);
  const data = { roomId: `${route}-${id}`, userId, viewId: id };

  socket.emit('leaveRoom', { data, room });

  dispatch(clearMetaDataSuccess(room));
};
