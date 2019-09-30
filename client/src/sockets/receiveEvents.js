import {
  AppEvents,
  CohortEvents,
  CohortHeaderEvents,
  CommentEvents,
  ItemsEvents,
  ItemStatusType,
  ListEvents,
  ListHeaderEvents
} from './enums';
import { cohortEventsController, listEventsController } from 'sockets/helpers';

export const receiveEvents = (store, socket) => {
  Object.values(ItemsEvents).forEach(event =>
    socket.on(event, data => store.dispatch({ type: event, payload: data }))
  );

  Object.values(ItemStatusType).forEach(event =>
    socket.on(event, data => store.dispatch({ type: event, payload: data }))
  );

  Object.values(CommentEvents).forEach(event =>
    socket.on(event, data => store.dispatch({ type: event, payload: data }))
  );

  Object.values(ListEvents).forEach(event =>
    socket.on(event, data => listEventsController(event, data, store))
  );

  Object.values(CohortEvents).forEach(event =>
    socket.on(event, data => cohortEventsController(event, data, store))
  );

  Object.values(ListHeaderEvents).forEach(event =>
    socket.on(event, data => store.dispatch({ type: event, payload: data }))
  );

  Object.values(CohortHeaderEvents).forEach(event =>
    socket.on(event, data => store.dispatch({ type: event, payload: data }))
  );

  Object.values(AppEvents).forEach(event =>
    socket.on(event, data => socket.emit(event, data))
  );
};
