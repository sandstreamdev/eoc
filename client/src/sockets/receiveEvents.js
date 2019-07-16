import {
  CommentEvents,
  ItemsEvents,
  ItemStatusType,
  ListEvents
} from './enums';

const receiveItemsEvents = (dispatch, socket) =>
  Object.values(ItemsEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

const receiveItemStatusTypeEvents = (dispatch, socket) =>
  Object.values(ItemStatusType).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

const receiveCommentEvents = (dispatch, socket) =>
  Object.values(CommentEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

const receiveListEvents = (dispatch, socket) =>
  Object.values(ListEvents).forEach(event =>
    socket.on(event, data => dispatch({ type: event, payload: data }))
  );

export const receiveEvents = (dispatch, socket) => {
  receiveItemsEvents(dispatch, socket);
  receiveItemStatusTypeEvents(dispatch, socket);
  receiveCommentEvents(dispatch, socket);
  receiveListEvents(dispatch, socket);
};
