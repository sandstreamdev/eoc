import { ItemsEvents, ItemStatusType } from './enums';

export const receiveEvents = (dispatch, socket) => {
  // Items events
  Object.values(ItemsEvents).forEach(event => {
    socket.on(event, data => {
      dispatch({ type: event, payload: data });
    });
  });

  Object.values(ItemStatusType).forEach(event => {
    socket.on(event, data => {
      console.log(event);

      dispatch({ type: event, payload: data });
    });
  });

  // List events
};
