import { FETCH_CURRENT_USER } from '../components/Main/actions';
import { LOGOUT_USER } from '../components/UserBar/actions';

const user = (state = null, action) => {
  switch (action.type) {
    case FETCH_CURRENT_USER:
      return action.payload;
    case LOGOUT_USER:
      return null;
    default:
      return state;
  }
};

export default user;
