import { ADD_ITEM, ADD_ITEM_SUCCESS } from '../components/SearchBar/actions';

const addItem = (state = {}, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return Object.assign({}, state, {
        isOrdered: action.item.isOrdered,
        name: action.item.name
      });
    default:
      return state;
  }
};

const addItemSuccess = (state = false, action) => {
  switch (action.type) {
    case ADD_ITEM_SUCCESS:
      return true;
    default:
      return state;
  }
};

export default addItem;
export { addItemSuccess };
