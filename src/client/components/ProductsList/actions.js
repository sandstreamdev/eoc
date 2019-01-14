import { ENDPOINT_URL } from '../../common/variables';

// Action types
export const TOGGLE_ITEM = 'TOGGLE_ITEM';
export const VOTE_FOR_ITEM = 'VOTE_FOR_ITEM';

// Action creators
const toggleItem = item => ({ type: TOGGLE_ITEM, item });
const voteForItem = item => ({ type: VOTE_FOR_ITEM, item });

const dispatchingDelay = 600;

const updateItem = (id, payload) =>
  fetch(`${ENDPOINT_URL}/item/${id}/update`, {
    body: JSON.stringify(payload),
    headers: { 'Content-Type': 'application/json' },
    method: 'PATCH'
  })
    .then(resp => resp.json())
    .catch(err => console.error(err));

export const toggle = (id, isOrdered, updatedAuthor) => dispatch => {
  const payload = {
    _id: id,
    isOrdered: !isOrdered,
    author: updatedAuthor,
    votes: []
  };
  updateItem(id, payload)
    .then(item =>
      setTimeout(() => dispatch(toggleItem(item)), dispatchingDelay)
    )
    .catch(err => console.error(err));
};

export const vote = (id, votes) => dispatch => {
  const payload = { _id: id, votes };
  updateItem(id, payload)
    .then(item => dispatch(voteForItem(item)))
    .catch(err => console.error(err));
};
