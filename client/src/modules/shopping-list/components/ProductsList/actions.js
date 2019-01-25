import { ENDPOINT_URL } from 'common/constants/variables';

// Action types
export const TOGGLE_ITEM = 'TOGGLE_ITEM';
export const VOTE_FOR_ITEM = 'VOTE_FOR_ITEM';

// Action creators
const toggleItem = item => ({ type: TOGGLE_ITEM, item });
const voteForItem = item => ({ type: VOTE_FOR_ITEM, item });

export const toggle = (id, isOrdered, updatedAuthor) => dispatch => {
  fetch(`${ENDPOINT_URL}/item/${id}/update`, {
    body: JSON.stringify({
      _id: id,
      isOrdered: !isOrdered,
      authorName: updatedAuthor
    }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH'
  })
    .then(resp => resp.json())
    .then(item => setTimeout(() => dispatch(toggleItem(item)), 600))
    .catch(err => console.error(err));
};

export const vote = (id, voterIds) => dispatch => {
  const payload = { _id: id, voterIds };
  console.log(payload);
  fetch(`${ENDPOINT_URL}/item/${id}/update`, {
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH'
  })
    .then(resp => resp.json())
    .then(item => dispatch(voteForItem(item)))
    .catch(err => console.error(err));
};
