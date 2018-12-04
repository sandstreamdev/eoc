import { ADD_ITEM } from '../components/SearchBar/actions';

const addItem = (state = {}, action) => {
  switch (action.type) {
    case ADD_ITEM:
      return Object.assign({}, state, {
        name: action.item.name,
        isOrdered: action.item.isOrdered
      });
    default:
      return state;
  }
};

export default addItem;
