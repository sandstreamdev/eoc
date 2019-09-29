import socket from 'sockets';
import { CommonActionTypes } from 'common/model/actionTypes';
import { AppEvents } from 'sockets/enums';
import { metaDataChannel } from 'common/utils/helpers';

export const clearMetaDataSuccess = () => ({
  type: CommonActionTypes.LEAVE_VIEW
});

export const enterView = (route, userId) =>
  socket.emit('enterView', { userId, view: route });

export const leaveView = (route, userId) =>
  socket.emit('leaveView', { userId, view: route });

export const joinRoom = (route, id, userId) => {
  const data = { roomId: `${route}-${id}`, userId, viewId: id };

  socket.emit(AppEvents.JOIN_ROOM, { data, room: route });
  socket.emit(AppEvents.LEAVE_ROOM, metaDataChannel(id, route));
};

export const leaveRoom = (route, id, userId) => isDisabled => {
  const data = { roomId: `${route}-${id}`, userId, viewId: id };

  socket.emit(AppEvents.LEAVE_ROOM, { data, room: route });

  if (!isDisabled) {
    socket.emit(AppEvents.JOIN_ROOM, metaDataChannel(id, route));
  }
};
