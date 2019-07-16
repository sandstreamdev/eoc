import {
  ItemsEvents,
  ItemStatusType,
  CommentEvents,
  ListEvents
} from './enums';

export const receiveEvents = (dispatch, socket) => {
  // Items events
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

  // List events
};
