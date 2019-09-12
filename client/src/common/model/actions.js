import socket from 'sockets';
import { CommonActionTypes } from 'common/model/actionTypes';
import { AppEvents } from 'sockets/enums';

export const clearMetaDataSuccess = () => ({
  type: CommonActionTypes.LEAVE_VIEW
});

export const enterView = (route, userId) => dispatch =>
  socket.emit('enterView', { userId, view: route });

export const leaveView = (route, userId) => dispatch => {
  dispatch(clearMetaDataSuccess());
  socket.emit('leaveView', { userId, view: route });
};

export const joinRoom = (route, id, userId) => dispatch => {
  const data = { roomId: `${route}-${id}`, userId, viewId: id };

  socket.emit(AppEvents.JOIN_ROOM, { data, room: route });
};

export const leaveRoom = (route, id, userId) => dispatch => {
  const data = { roomId: `${route}-${id}`, userId, viewId: id };

  socket.emit(AppEvents.LEAVE_ROOM, { data, room: route });

  dispatch(clearMetaDataSuccess());
};
