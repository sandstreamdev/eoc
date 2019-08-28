import { NotificationActionTypes } from './actionsTypes';

const notifications = (state = {}, action) => {
  switch (action.type) {
    case NotificationActionTypes.ADD: {
      const { id, notification, redirect, type } = action.payload;

      return {
        ...state,
        [id]: { notification, redirect, type }
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
