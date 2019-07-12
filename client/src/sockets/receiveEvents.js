import { ItemsEvents } from './enums';

export const receiveEvents = (dispatch, socket) => {
  // Items events
  Object.values(ItemsEvents).forEach(event => {
    console.log(event);
    socket.on(event, data => {
      console.log(data);
      dispatch({ type: event, payload: data });
    });
  });

  // List events
};
