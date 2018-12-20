import { ENDPOINT_URL } from '../../common/variables';

export const TOGGLE_ITEM = 'TOGGLE_ITEM';

const toggleItem = item => ({ type: TOGGLE_ITEM, item });

const dispatchToggleItem = (id, isOrdered, updatedAuthor) => dispatch => {
  fetch(`${ENDPOINT_URL}/item/${id}/update`, {
    body: JSON.stringify({
      _id: id,
      isOrdered: !isOrdered,
      author: updatedAuthor
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

export default dispatchToggleItem;
