import { SET_CURRENT_USER } from '../components/Main/actions';

const user = (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return action.payload;
    default:
      return state;
  }
};

export default user;
