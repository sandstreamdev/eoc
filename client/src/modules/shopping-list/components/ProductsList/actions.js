import { ENDPOINT_URL } from 'common/constants/variables';
import { patchData } from 'common/utils/fetchMethods';
import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';
import { MessageType as NotificationType } from 'common/constants/enums';
import { createNotificationWithTimeout } from 'modules/notification/model/actions';

// Action creators
const toggleProductSuccess = product => ({
  type: ProductActionTypes.TOGGLE_PRODUCT_SUCCESS,
  product
});
const toggleProductRequest = () => ({
  type: ProductActionTypes.TOGGLE_PRODUCT_REQUEST
});
const toggleProductFailure = errMessage => ({
  type: ProductActionTypes.TOGGLE_PRODUCT_FAILURE,
  errMessage
});
const voteForProductSuccess = product => ({
  type: ProductActionTypes.VOTE_FOR_PRODUCT_SUCCESS,
  product
});
const voteForProductRequest = () => ({
  type: ProductActionTypes.VOTE_FOR_PRODUCT_REQUEST
});
const voteForProductFailure = errMessage => ({
  type: ProductActionTypes.VOTE_FOR_PRODUCT_FAILURE,
  errMessage
});

export const toggle = (id, isOrdered, updatedAuthor) => dispatch => {
  dispatch(toggleProductRequest());
  patchData(`${ENDPOINT_URL}/item/${id}/update`, {
    _id: id,
    isOrdered: !isOrdered,
    authorName: updatedAuthor
  })
    .then(resp => resp.json())
    .then(product =>
      setTimeout(() => dispatch(toggleProductSuccess(product)), 600)
    )
    .catch(err => {
      dispatch(toggleProductFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, setting item as done failed..."
      );
    });
};

export const vote = (id, voterIds) => dispatch => {
  dispatch(voteForProductRequest());
  const payload = { _id: id, voterIds };
  patchData(`${ENDPOINT_URL}/item/${id}/update`, payload)
    .then(resp => resp.json())
    .then(product => dispatch(voteForProductSuccess(product)))
    .catch(err => {
      dispatch(voteForProductFailure());
      createNotificationWithTimeout(
        dispatch,
        NotificationType.ERROR,
        "Oops, we're sorry, voting failed...."
      );
    });
};
