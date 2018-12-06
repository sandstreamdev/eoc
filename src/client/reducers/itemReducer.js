import { ADD_ITEM } from '../components/SearchBar/actions';

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

export default addItem;
