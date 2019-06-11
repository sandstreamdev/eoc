import { NotificationActionTypes } from './actionsTypes';

const notifications = (state = {}, action) => {
  switch (action.type) {
    case NotificationActionTypes.ADD: {
      const { id, notification, type } = action.payload;
      return {
        ...state,
        [id]: { type, notification }
      };
    }
    case NotificationActionTypes.REMOVE: {
      const { [action.payload]: removed, ...newState } = state;
      return newState;
    }
    default:
      return state;
  }
};

export default notifications;
