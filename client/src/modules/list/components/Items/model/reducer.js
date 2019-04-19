import { ItemActionTypes } from 'modules/list/components/Items/model/actionTypes';

const items = (state, action) => {
  switch (action.type) {
    case ItemActionTypes.ADD_SUCCESS:
    case ItemActionTypes.CLONE_SUCCESS:
      return { ...state, items: [action.payload.item, ...state.items] };
    case ItemActionTypes.TOGGLE_SUCCESS:
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.item._id
            ? {
                ...action.payload.item,
                isOrdered: action.payload.item.isOrdered
              }
            : item
        )
      };
    case ItemActionTypes.VOTE_SUCCESS:
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload.item._id
            ? {
                ...action.payload.item,
                voterIds: action.payload.item.voterIds
              }
            : item
        )
      };
    case ItemActionTypes.UPDATE_DETAILS_SUCCESS: {
      const {
        payload: {
          data: { description, link },
          itemId
        }
      } = action;

      return {
        ...state,
        items: state.items.map(item =>
          item._id === itemId
            ? {
                ...item,
                description: description || item.description,
                link: link || item.link
              }
            : item
        )
      };
    }
    default:
      return state;
  }
};

export default items;
