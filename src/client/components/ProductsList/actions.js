import { ENDPOINT_URL } from 'common/variables';

// Action types
export const TOGGLE_ITEM = 'TOGGLE_ITEM';

// Action creators
const toggleItem = item => ({ type: TOGGLE_ITEM, item });

// Dispatchers
const toggle = (id, isOrdered) => dispatch => {
  fetch(`${ENDPOINT_URL}/item/${id}/update`, {
    body: JSON.stringify({ _id: id, isOrdered: !isOrdered }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH'
  })
    .then(resp => resp.json())
    .then(item => setTimeout(() => dispatch(toggleItem(item)), 500))
    .catch(err => console.error(err));
};

export default toggle;
