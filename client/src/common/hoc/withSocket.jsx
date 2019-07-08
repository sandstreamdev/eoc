import React from 'react';

import SocketContext from 'common/context/socket-context';

const withSocket = WrappedComponent => props => (
  <SocketContext.Consumer>
    {socket => <WrappedComponent {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default withSocket;
