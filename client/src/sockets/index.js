import io from 'socket.io-client';

const socket = io({ forceNew: true });

export default socket;
