import {
  CohortEvents,
  CohortHeaderEvents,
  CommentEvents,
  ItemsEvents,
  ItemStatusType,
  ListEvents,
  ListHeaderEvents
} from './enums';
import { cohortEventsController, listEventsController } from 'sockets/helpers';

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
    socket.on(event, data => listEventsController(event, data, dispatch))
  );

  Object.values(CohortEvents).forEach(event =>
    socket.on(event, data => cohortEventsController(event, data, dispatch))
  );

  Object.values(ListHeaderEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

  Object.values(CohortHeaderEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );
};
