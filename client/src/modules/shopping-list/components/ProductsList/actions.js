import { ENDPOINT_URL } from 'common/constants/variables';
import { patchData } from 'common/utils/fetchMethods';
import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

const toggleProductSuccess = (product, listId) => ({
  type: ProductActionTypes.TOGGLE_PRODUCT_SUCCESS,
  payload: { product, listId }
});
const toggleProductRequest = () => ({
  type: ProductActionTypes.TOGGLE_PRODUCT_REQUEST
});
const toggleProductFailure = errMessage => ({
  type: ProductActionTypes.TOGGLE_PRODUCT_FAILURE,
  payload: errMessage
});
const voteForProductSuccess = (product, listId) => ({
  type: ProductActionTypes.VOTE_FOR_PRODUCT_SUCCESS,
  payload: { product, listId }
});
const voteForProductRequest = () => ({
  type: ProductActionTypes.VOTE_FOR_PRODUCT_REQUEST
});
const voteForProductFailure = errMessage => ({
  type: ProductActionTypes.VOTE_FOR_PRODUCT_FAILURE,
  payload: errMessage
});

export const toggle = (
  isOrdered,
  itemId,
  listId,
  updatedAuthor
) => dispatch => {
  dispatch(toggleProductRequest());
  patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update-item`, {
    authorName: updatedAuthor,
    itemId,
    isOrdered: !isOrdered,
    listId
  })
    .then(resp => resp.json())
    .then(product =>
      setTimeout(() => dispatch(toggleProductSuccess(product, listId)), 600)
    )
    .catch(err => {
      dispatch(toggleProductFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, changing item's status failed..."
      );
    });
};

export const vote = (itemId, listId, voterIds) => dispatch => {
  dispatch(voteForProductRequest());
  patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update-item`, {
    itemId,
    voterIds
  })
    .then(resp => resp.json())
    .then(product => dispatch(voteForProductSuccess(product, listId)))
    .catch(err => {
      dispatch(voteForProductFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        err.message || "Oops, we're sorry, voting failed...."
      );
    });
};
