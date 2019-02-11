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
  isOrdered,
  itemId,
  listId,
  updatedAuthor
) => dispatch => {
  patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update-item`, {
    authorName: updatedAuthor,
    itemId,
    isOrdered: !isOrdered,
    listId
  })
    .then(resp => resp.json())
    .then(product =>
      setTimeout(() => dispatch(toggleProduct(product, listId)), 600)
    )
    .catch(err => console.error(err));
};

export const vote = (itemId, listId, voterIds) => dispatch => {
  patchData(`${ENDPOINT_URL}/shopping-lists/${listId}/update-item`, {
    itemId,
    voterIds
  })
    .then(resp => resp.json())
    .then(product => dispatch(voteForProduct(product, listId)))
    .catch(err => console.error(err));
};
