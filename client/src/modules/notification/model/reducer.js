import { NotificationActionTypes } from './actionsTypes';

const notifications = (state = {}, action) => {
  switch (action.type) {
    case NotificationActionTypes.ADD_NOTIFICATION: {
      const { id, message, type } = action.notification;
      return {
        ...state,
        [id]: { type, message }
      };
    }
    case NotificationActionTypes.REMOVE_NOTIFICATION: {
      const { [action.id]: removed, ...newState } = state;
      return newState;
    }
    default:
      return state;
  }
};

export default notifications;
