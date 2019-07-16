import { CohortEvents, ListEvents } from './enums';

const receiveListEvents = (dispatch, socket) =>
  Object.values(ListEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

const receiveCohortEvents = (dispatch, socket) =>
  Object.values(CohortEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

export const receiveEvents = (dispatch, socket) => {
  receiveCohortEvents(dispatch, socket);
  receiveListEvents(dispatch, socket);
};
