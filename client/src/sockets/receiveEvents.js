import {
  ITEMS_EVENTS,
  LIST_EVENTS
  // COHORT_EVENTS,
  // ACTIVITIES_EVENTS,
  // COMMENT_EVENTS
} from './enums';

export const receiveEvents = (dispatch, socket) => {
  // Items events
  Object.entries(ITEMS_EVENTS).forEach(event => {
    socket.on(event, data => {
      dispatch({ type: event, payload: data });
    });
  });

  // List events
  Object.entries(LIST_EVENTS).forEach(event => {
    socket.on(event, data => {
      dispatch({ type: event, payload: data });
    });
  });

  // Etc....
};
