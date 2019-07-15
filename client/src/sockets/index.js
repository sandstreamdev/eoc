import io from 'socket.io-client';

import { capitalizeString } from 'common/utils/helpers';

const socket = io({ forceNew: true });

export const joinRoom = (route, id) => {
  const room = capitalizeString(route);

  socket.emit(`join${room}Room`, `${route}-${id}`);
};

export const leaveRoom = (route, id) => {
  const room = capitalizeString(route);

  socket.emit(`leave${room}Room`, id);
};

export default socket;
