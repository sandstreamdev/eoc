import { ENDPOINT_URL } from 'common/constants/variables';
import { patchData } from 'common/utils/fetchMethods';
import { ItemActionTypes } from 'modules/list/components/InputBar/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

const toggleItemSuccess = (item, listId) => ({
  type: ItemActionTypes.TOGGLE_SUCCESS,
  payload: { item, listId }
});
const toggleItemRequest = () => ({
  type: ItemActionTypes.TOGGLE_REQUEST
});
const toggleItemFailure = errMessage => ({
  type: ItemActionTypes.TOGGLE_FAILURE,
  payload: errMessage
});
const voteForItemSuccess = (item, listId) => ({
  type: ItemActionTypes.VOTE_SUCCESS,
  payload: { item, listId }
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
  return patchData(`${ENDPOINT_URL}/lists/${listId}/update-item`, {
    authorName: updatedAuthor,
    itemId,
    isOrdered: !isOrdered,
    listId
  })
    .then(resp => resp.json())
    .then(item =>
      setTimeout(() => dispatch(toggleItemSuccess(item, listId)), 600)
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

export const vote = (itemId, listId, isVoted) => dispatch => {
  dispatch(voteForItemRequest());
  const path = isVoted
    ? `${ENDPOINT_URL}/lists/${listId}/clear-vote`
    : `${ENDPOINT_URL}/lists/${listId}/set-vote`;

  return patchData(path, { itemId })
    .then(resp => resp.json())
    .then(item => dispatch(voteForItemSuccess(item, listId)))
    .catch(err => {
      dispatch(voteForItemFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, voting failed...."
      );
    });
};
