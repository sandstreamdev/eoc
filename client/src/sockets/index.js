import io from 'socket.io-client';

import { capitalizeString } from 'common/utils/helpers';

const socketInstance = io({ forceNew: true });

export const joinRoom = (route, id) => {
  const room = capitalizeString(route);

  socketInstance.emit(`join${room}Room`, `${route}-${id}`);
};

export const leaveRoom = (route, id) => {
  const room = capitalizeString(route);

  socketInstance.emit(`leave${room}Room`, id);
};

export default socketInstance;
