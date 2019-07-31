import {
  ActivityActionTypes,
  CohortEvents,
  CohortHeaderEvents,
  CommentEvents,
  ItemsEvents,
  ItemStatusType,
  ListEvents,
  ListHeaderEvents
} from './enums';
import { listEventsController } from 'sockets/helpers';
import { ActivitiesActionTypes } from 'common/components/Activities/model/actionTypes';

export const receiveEvents = (dispatch, socket) => {
  Object.values(ItemsEvents).forEach(event =>
    socket.on(event, data => {
      dispatch({ type: ActivitiesActionTypes.SHOULD_UPDATE, payload: true });
      dispatch({ type: event, payload: data });
    })
  );

  Object.values(ItemStatusType).forEach(event =>
    socket.on(event, data => {
      dispatch({ type: ActivitiesActionTypes.SHOULD_UPDATE, payload: true });
      dispatch({ type: event, payload: data });
    })
  );

  Object.values(CommentEvents).forEach(event =>
    socket.on(event, data => {
      dispatch({ type: ActivitiesActionTypes.SHOULD_UPDATE, payload: true });
      dispatch({ type: event, payload: data });
    })
  );

  Object.values(ListEvents).forEach(event =>
    socket.on(event, data => {
      dispatch({ type: ActivitiesActionTypes.SHOULD_UPDATE, payload: true });
      listEventsController(event, data, dispatch);
    })
  );

  Object.values(CohortEvents).forEach(event =>
    socket.on(event, data => {
      dispatch({ type: ActivitiesActionTypes.SHOULD_UPDATE, payload: true });
      dispatch({ type: event, payload: data });
    })
  );

  Object.values(ListHeaderEvents).forEach(event =>
    socket.on(event, data => {
      dispatch({ type: ActivitiesActionTypes.SHOULD_UPDATE, payload: true });
      dispatch({ type: event, payload: data });
    })
  );

  Object.values(CohortHeaderEvents).forEach(event =>
    socket.on(event, data => {
      dispatch({ type: ActivitiesActionTypes.SHOULD_UPDATE, payload: true });
      dispatch({ type: event, payload: data });
    })
  );

  socket.on(ActivityActionTypes.UPDATE_ACTIVITIES, data => {
    const { shouldUpdate } = data;

    dispatch({
      type: ActivitiesActionTypes.SHOULD_UPDATE,
      payload: shouldUpdate
    });
  });
};
