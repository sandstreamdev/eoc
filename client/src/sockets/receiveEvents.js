import { CohortEvents, ListEvents } from './enums';

export const receiveEvents = (dispatch, socket) => {
  Object.values(ListEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

  Object.values(CohortEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );
};
