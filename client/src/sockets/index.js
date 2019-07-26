import io from 'socket.io-client';
import _upperFirst from 'lodash/upperFirst';

const socket = io({ forceNew: true });

export const joinRoom = (route, id, userId) => {
  const room = _upperFirst(route);
  const data = { room: `${route}-${id}`, userId, viewId: id };

  socket.emit(`join${room}Room`, data);
};

export const leaveRoom = (route, id, userId) => {
  const room = _upperFirst(route);
  const data = { room: `${route}-${id}`, userId, viewId: id };

  socket.emit(`leave${room}Room`, data);
};

export const enterView = (route, userId) => {
  const view = _upperFirst(route);

  socket.emit(`enter${view}View`, userId);
};

export const leaveView = (route, userId) => {
  const view = _upperFirst(route);

  socket.emit(`leave${view}View`, userId);
};

export default socket;
