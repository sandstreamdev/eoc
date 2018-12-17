import { currentUser } from './initalState';
import { FETCH_CURRENT_USER } from '../components/Main/actions';
import { LOGOUT_USER } from '../components/UserBar/actions';
import { getCookie } from '../common/utilites';

const user = (state = currentUser, action) => {
  switch (action.type) {
    case FETCH_CURRENT_USER: {
      const userCookie = getCookie('user_name');

      if (userCookie) {
        return decodeURIComponent(userCookie);
      }

      return null;
    }

    case LOGOUT_USER:
      return null;
    default:
      return state;
  }
};

export default user;
