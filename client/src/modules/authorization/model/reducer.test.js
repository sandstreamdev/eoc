import { AuthorizationActionTypes } from './actions';
import reducer from 'modules/authorization/model/reducer';

describe('Authorization reducer', () => {
  it('should store user data upon login', () => {
    expect(
      reducer(null, {
        type: AuthorizationActionTypes.SET_CURRENT_USER,
        payload: {
          name: 'John Smith',
          avatarUrl: 'http://www.example.com',
          id: '12345'
        }
      })
    ).toEqual({
      name: 'John Smith',
      avatarUrl: 'http://www.example.com',
      id: '12345'
    });
  });

  it('should delete user data upon logout', () => {
    expect(
      reducer(
        {
          name: 'John Smith',
          avatarUrl: 'http://www.example.com',
          id: '12345'
        },
        {
          type: AuthorizationActionTypes.LOGOUT_USER
        }
      )
    ).toEqual(null);
  });
});
