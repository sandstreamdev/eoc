import { ActivityActionTypes } from './actionTypes';

const activities = (state = [], action) => {
  switch (action.type) {
    case ActivityActionTypes.FETCH_SUCCESS: {
      const { payload } = action;

      return [...payload];
    }
    default:
      return state;
  }
};

export default activities;
