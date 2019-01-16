import { SET_CURRENT_USER } from 'modules/legacy/mainActions';

const user = (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
};

export default user;
