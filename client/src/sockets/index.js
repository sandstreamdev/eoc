import io from 'socket.io-client';
import _upperFirst from 'lodash/upperFirst';

const socket = io({ forceNew: true });

export const joinRoom = (route, id) => {
  const room = _upperFirst(route);

  socket.emit(`join${room}Room`, `${route}-${id}`);
};

export const leaveRoom = (route, id) => {
  const room = _upperFirst(route);

  socket.emit(`leave${room}Room`, id);
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
