import io from 'socket.io-client';

import { AppEvents } from 'sockets/enums';
import { channel, metaDataChannel } from 'common/utils/helpers';

const socket = io({ forceNew: true });

export const joinRoom = ({ resourceId, roomPrefix, subscribeMetaData }) => {
  const room = channel(resourceId, roomPrefix);

  socket.emit(AppEvents.JOIN_ROOM, room);

  if (subscribeMetaData) {
    const metaDataRoom = metaDataChannel(resourceId, roomPrefix);

    socket.emit(AppEvents.LEAVE_ROOM, metaDataRoom);
  }
};

export const leaveRoom = ({ resourceId, roomPrefix, subscribeMetaData }) => {
  const room = channel(resourceId, roomPrefix);

  socket.emit(AppEvents.LEAVE_ROOM, room);

  if (subscribeMetaData) {
    const metaDataRoom = metaDataChannel(resourceId, roomPrefix);

    socket.emit(AppEvents.JOIN_ROOM, metaDataRoom);
  }
};

export default socket;
