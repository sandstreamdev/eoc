import { ADD_ITEM } from './actionTypes';

export default function addItem(item) {
  return { type: ADD_ITEM, item };
}
