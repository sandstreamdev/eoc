import { ENDPOINT_URL } from 'common/constants/variables';
import { patchData } from 'common/utils/fetchMethods';
import { ItemActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

const toggleItemSuccess = (product, listId) => ({
  type: ItemActionTypes.TOGGLE_SUCCESS,
  payload: { product, listId }
});
const toggleItemRequest = () => ({
  type: ItemActionTypes.TOGGLE_REQUEST
});
const toggleItemFailure = errMessage => ({
  type: ItemActionTypes.TOGGLE_FAILURE,
  payload: errMessage
});
const voteForItemSuccess = (product, listId) => ({
  type: ItemActionTypes.VOTE_SUCCESS,
  payload: { product, listId }
});
const voteForItemRequest = () => ({
  type: ItemActionTypes.VOTE_REQUEST
});
const voteForItemFailure = errMessage => ({
  type: ItemActionTypes.VOTE_FAILURE,
  payload: errMessage
});

export const toggle = (
  isOrdered,
  itemId,
  listId,
  updatedAuthor
) => dispatch => {
  dispatch(toggleItemRequest());
  patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update-item`, {
    authorName: updatedAuthor,
    itemId,
    isOrdered: !isOrdered,
    listId
  })
    .then(resp => resp.json())
    .then(product =>
      setTimeout(() => dispatch(toggleItemSuccess(product, listId)), 600)
    )
    .catch(err => {
      dispatch(toggleItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, changing item's status failed..."
      );
    });
};

export const vote = (itemId, listId, voterIds) => dispatch => {
  dispatch(voteForItemRequest());
  patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update-item`, {
    itemId,
    voterIds
  })
    .then(resp => resp.json())
    .then(product => dispatch(voteForItemSuccess(product, listId)))
    .catch(err => {
      dispatch(voteForItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, voting failed...."
      );
    });
};
