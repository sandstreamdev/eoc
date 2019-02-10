import { ENDPOINT_URL } from 'common/constants/variables';
import { patchData } from 'common/utils/fetchMethods';
import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';

// Action creators
const toggleProduct = (product, listId) => ({
  type: ProductActionTypes.TOGGLE_PRODUCT,
  payload: { product, listId }
});
const voteForProduct = (product, listId) => ({
  type: ProductActionTypes.VOTE_FOR_PRODUCT,
  payload: { product, listId }
});

export const toggle = (
  itemId,
  listId,
  isOrdered,
  updatedAuthor
) => dispatch => {
  patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update-item`, {
    itemId,
    isOrdered: !isOrdered,
    authorName: updatedAuthor,
    listId
  })
    .then(resp => resp.json())
    .then(product =>
      setTimeout(() => dispatch(toggleProduct(product, listId)), 600)
    )
    .catch(err => console.error(err));
};

export const vote = (id, voterIds) => dispatch => {
  const payload = { _id: id, voterIds };
  patchData(`${ENDPOINT_URL}/item/${id}/update`, payload)
    .then(resp => resp.json())
    .then(product => dispatch(voteForProduct(product)))
    .catch(err => console.error(err));
};
