import { LIST_EVENTS } from './enums';

export const receiveEvents = (dispatch, socket) => {
  Object.entries(LIST_EVENTS).forEach(event => {
    socket.on(event, data => {
      dispatch({ type: event, payload: data });
    });
  });
};
