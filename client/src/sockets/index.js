import io from 'socket.io-client';

const socketInstance = io({ forceNew: true });

export const joinRoom = (route, id) =>
  socketInstance.emit(`joinRoom-${route}`, `${route}-${id}`);

export const leaveRoom = (route, id) =>
  socketInstance.emit(`leaveRoom-${route}`, id);

export default socketInstance;
