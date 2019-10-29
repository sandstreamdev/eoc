import _isEmpty from 'lodash/isEmpty';

import { CommonActionTypes } from 'common/model/actionTypes';
import { LibrariesActionTypes } from './actionTypes';

const libraries = (state = {}, action) => {
  switch (action.type) {
    case LibrariesActionTypes.FETCH_LIBRARIES_SUCCESS: {
      return action.payload;
    }
    case LibrariesActionTypes.FETCH_LICENSE_SUCCESS: {
      const { data, library } = action.payload;

      if (_isEmpty(state)) {
        return state;
      }

      return {
        ...state,
        [library]: { ...state[library], license: data }
      };
    }
    case CommonActionTypes.LEAVE_VIEW: {
      return {};
    }
    default:
      return state;
  }
};

export default libraries;
