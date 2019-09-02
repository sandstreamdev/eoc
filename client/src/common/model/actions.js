import socket from 'sockets';
import { CommonActionTypes } from 'common/model/actionTypes';
import { getJson } from 'common/utils/fetchMethods';

const clearMetaDataSuccess = view => ({
  type: CommonActionTypes.LEAVE_VIEW,
  payload: view
});

export const enterView = (route, userId) => dispatch =>
  socket.emit('enterView', { userId, view: route });

export const leaveView = (route, userId) => dispatch => {
  dispatch(clearMetaDataSuccess(route));
  socket.emit('leaveView', { userId, view: route });
};

export const joinRoom = (route, id, userId) => dispatch => {
  const data = { roomId: `${route}-${id}`, userId, viewId: id };

  socket.emit('joinRoom', { data, room: route });
};

export const leaveRoom = (route, id, userId) => dispatch => {
  const data = { roomId: `${route}-${id}`, userId, viewId: id };

  socket.emit('leaveRoom', { data, room: route });

  dispatch(clearMetaDataSuccess(route));
};

export const getUserName = token =>
  getJson(`/auth/user-name/${token}`).then(({ displayName }) => displayName);
