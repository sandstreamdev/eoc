import { ENDPOINT_URL } from 'common/constants/variables';
import { postData } from 'common/utils/fetchMethods';
import { ItemActionTypes } from './actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

const addItemFailure = errorMessage => ({
  type: ItemActionTypes.ADD_ITEM_FAILURE,
  payload: errorMessage
});
export const addItemSuccess = (product, listId) => ({
  type: ItemActionTypes.ADD_ITEM_SUCCESS,
  payload: { product, listId }
});
const addItemRequest = () => ({
  type: ItemActionTypes.ADD_ITEM_REQUEST
});

export const addItemToList = (product, listId) => dispatch => {
  dispatch(addItemRequest());
  postData(`${ENDPOINT_URL}/shopping-lists/add-product`, { product, listId })
    .then(resp => resp.json())
    .then(json => dispatch(addItemSuccess(json, listId)))
    .catch(err => {
      dispatch(addItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, adding item failed..."
      );
    });
};
