import io from 'socket.io-client';

const socket = io({ forceNew: true });

export const enterApp = userId => socket.emit('enterApp', { userId });

export const leaveApp = userId => socket.emit('leaveApp', { userId });

export default socket;
