import { COHORT_EVENTS, LIST_EVENTS } from './enums';

export const receiveEvents = (dispatch, socket) => {
  Object.entries(LIST_EVENTS).forEach(event => {
    socket.on(event, data => {
      console.log(event, data);
      dispatch({ type: event, payload: data });
    });
  });

  Object.entries(COHORT_EVENTS).forEach(event => {
    socket.on(event, data => {
      console.log(event, data);
      dispatch({ type: event, payload: data });
    });
  });
};
