import { LOGOUT_USER } from 'app/components/Toolbar/components/UserBar/actions';
import { SET_CURRENT_USER } from 'app/components/Toolbar/actions';

const user = (state = null, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return action.payload;
    case LOGOUT_USER:
      return null;
    default:
      return state;
  }
};

export default user;
