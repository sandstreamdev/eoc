import { ActivityActionTypes } from 'modules/activity/model/actionTypes';

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
