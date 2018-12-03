import add from '../_actions/itemActions';

const addItem = item => dispatch => {
  dispatch(add(item));
};

export default addItem;
