import { ActivitiesActionTypes } from './actionTypes';
import initialState from './initialState';

const activities = (state = initialState, action) => {
  switch (action.type) {
    case ActivitiesActionTypes.FETCH_SUCCESS: {
      const { activities, isNextPage, nextPage } = action.payload;

      return { data: { ...state.data, ...activities }, isNextPage, nextPage };
    }
    case ActivitiesActionTypes.REMOVE:
      return initialState;
    default:
      return state;
  }
};

export default activities;
