export const TOGGLE_ITEM = 'TOGGLE_ITEM';

const toggleItem = item => ({ type: TOGGLE_ITEM, item });

const dispatchToggleItem = (id, isOrdered) => dispatch => {
  fetch(`http://localhost:8080/item/${id}/update`, {
    body: JSON.stringify({ _id: id, isOrdered: !isOrdered }),
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH'
  })
    .then(resp => resp.json())
    .then(item => dispatch(toggleItem(item)))
    .catch(err => console.error(err));
};

export default dispatchToggleItem;
