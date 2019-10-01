import socket from 'sockets';
import { CommonActionTypes } from 'common/model/actionTypes';
import { AppEvents } from 'sockets/enums';
import { channel, metaDataChannel } from 'common/utils/helpers';

export const clearMetaDataSuccess = () => ({
  type: CommonActionTypes.LEAVE_VIEW
});

export const enterView = (route, userId) =>
  socket.emit('enterView', { userId, view: route });

export const leaveView = (route, userId) =>
  socket.emit('leaveView', { userId, view: route });

export const joinRoom = ({
  resourceId,
  roomPrefix,
  subscribeMetaData,
  userId
}) => {
  const room = channel(resourceId, roomPrefix);

  /**
   * This code is for the old functionality to work.
   * After refactoring socket emission it will be removed
   */
  const data = {
    userId,
    viewId: resourceId,
    viewName: roomPrefix
  };

  socket.emit(AppEvents.JOIN_ROOM, {
    data,
    room
  });

  if (subscribeMetaData) {
    const metaDataRoom = metaDataChannel(resourceId, roomPrefix);

    socket.emit(AppEvents.LEAVE_ROOM, metaDataRoom);
  }
};

export const leaveRoom = ({
  resourceId,
  roomPrefix,
  subscribeMetaData,
  userId
}) => {
  const room = channel(resourceId, roomPrefix);
  const data = {
    userId,
    viewId: resourceId,
    viewName: roomPrefix
  };

  socket.emit(AppEvents.LEAVE_ROOM, { data, room });

  if (subscribeMetaData) {
    const metaDataRoom = metaDataChannel(resourceId, roomPrefix);

    socket.emit(AppEvents.JOIN_ROOM, metaDataRoom);
  }
};
