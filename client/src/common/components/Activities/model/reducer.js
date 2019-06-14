import { ActivitiesActionTypes } from './actionTypes';

const activities = (state = { data: {}, page: 1 }, action) => {
  switch (action.type) {
    case ActivitiesActionTypes.FETCH_SUCCESS: {
      const { activities, page } = action.payload;

      return { data: { ...state.data, ...activities }, page };
    }
    default:
      return state;
  }
};

export default activities;
