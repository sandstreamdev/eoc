import { ENDPOINT_URL } from 'common/constants/variables';
import { patchData } from 'common/utils/fetchMethods';

// Action types
export const TOGGLE_ITEM = 'TOGGLE_ITEM';
export const VOTE_FOR_ITEM = 'VOTE_FOR_ITEM';

// Action creators
const toggleItem = item => ({ type: TOGGLE_ITEM, item });
const voteForItem = item => ({ type: VOTE_FOR_ITEM, item });

export const toggle = (id, isOrdered, updatedAuthor) => dispatch => {
  patchData(
    `${ENDPOINT_URL}/item/${id}/update`,
    JSON.stringify({
      _id: id,
      isOrdered: !isOrdered,
      authorName: updatedAuthor
    })
  )
    .then(resp => resp.json())
    .then(item => setTimeout(() => dispatch(toggleItem(item)), 600))
    .catch(err => console.error(err));
};

export const vote = (id, votes) => dispatch => {
  const payload = { _id: id, votes };
  patchData(`${ENDPOINT_URL}/item/${id}/update`, JSON.stringify(payload))
    .then(resp => resp.json())
    .then(item => dispatch(voteForItem(item)))
    .catch(err => console.error(err));
};
