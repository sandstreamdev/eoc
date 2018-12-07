import initialState from './initalState';
import { FETCH_ITEMS } from '../App/actions';
import { TOGGLE_ITEM } from '../components/ProductsList/actions';
import { ADD_ITEM_SUCCESS } from '../components/SearchBar/actions';

const items = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ITEM_SUCCESS:
      return Object.assign({}, state, {
        shoppingList: state.shoppingList.concat([action.item]).reverse()
      });
    case FETCH_ITEMS:
      console.log(action);
      return action.items;
    case TOGGLE_ITEM:
      console.log(state, action);
      //   console.log(action);
      //   // return Object.assign({}, state, {
      //   //   // shoppingList: state.shoppingList.map(item => {
      //   //   //   if (item._id === action.id) {
      //   //   //     item.isOrdered = !item.isOrdered;
      //   //   //   }
      //   //   // })
      //   });
      break;
    default:
      return state;
  }
};

export default items;
