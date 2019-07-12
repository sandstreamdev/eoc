import io from 'socket.io-client';

import { capitalizeString } from 'common/utils/helpers';

const socketInstance = io({ forceNew: true });

export const joinRoom = (route, id, userId) => {
  const room = capitalizeString(route);
  const data = { room: `${route}-${id}`, userId };

  socketInstance.emit(`join${room}Room`, data);
};

export const leaveRoom = (route, id, userId) => {
  const room = capitalizeString(route);
  const data = { room: `${route}-${id}`, userId };

  socketInstance.emit(`leave${room}Room`, data);
};

export const enterView = (route, userId) => {
  const view = capitalizeString(route);

  socketInstance.emit(`enter${view}View`, userId);
};

export const leaveView = (route, userId) => {
  const view = capitalizeString(route);

  socketInstance.emit(`leave${view}View`, userId);
};

export default socketInstance;
