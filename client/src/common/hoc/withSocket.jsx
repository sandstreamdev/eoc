import React from 'react';

import SocketContext from 'common/context/socket-context';

const withSocket = WrappedComponent => {
  const WithHOC = props => {
    return (
      <SocketContext.Consumer>
        {socket => <WrappedComponent {...props} socket={socket} />}
      </SocketContext.Consumer>
    );
  };

  WithHOC.WrappedComponent = WrappedComponent;

  return WithHOC;
};

export default withSocket;
