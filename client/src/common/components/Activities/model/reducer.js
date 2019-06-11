import { ActivitiesActionTypes } from './actionTypes';

const activities = (state = [], action) => {
  switch (action.type) {
    case ActivitiesActionTypes.FETCH_SUCCESS: {
      const { payload } = action;

      return payload;
    }
    default:
      return state;
  }
};

export default activities;
