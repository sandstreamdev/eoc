import {
  CohortEvents,
  CommentEvents,
  ItemsEvents,
  ItemStatusType,
  ListEvents,
  ListHeaderEvents
} from './enums';

export const receiveEvents = (dispatch, socket) => {
  Object.values(ItemsEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

  Object.values(ItemStatusType).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

  Object.values(CommentEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

  Object.values(ListEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

  Object.values(CohortEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

  Object.values(ListHeaderEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );
};
