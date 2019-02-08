import { ENDPOINT_URL } from 'common/constants/variables';
import { patchData } from 'common/utils/fetchMethods';
import { ProductActionTypes } from 'modules/shopping-list/components/InputBar/model/actionTypes';

// Action creators
const toggleProduct = product => ({
  type: ProductActionTypes.TOGGLE_PRODUCT,
  product
});
const voteForProduct = product => ({
  type: ProductActionTypes.VOTE_FOR_PRODUCT,
  product
});

export const toggle = (id, listId, isOrdered, updatedAuthor) => dispatch => {
  console.log({ id, listId, isOrdered, updatedAuthor });
  patchData(`${ENDPOINT_URL}/shopping-lists/${id}/update-item`, {
    _id: id,
    isOrdered: !isOrdered,
    authorName: updatedAuthor,
    listId
  })
    .then(resp => resp.json())
    .then(product => setTimeout(() => dispatch(toggleProduct(product)), 600))
    .catch(err => console.error(err));
};

export const vote = (id, voterIds) => dispatch => {
  const payload = { _id: id, voterIds };
  patchData(`${ENDPOINT_URL}/item/${id}/update`, payload)
    .then(resp => resp.json())
    .then(product => dispatch(voteForProduct(product)))
    .catch(err => console.error(err));
};
