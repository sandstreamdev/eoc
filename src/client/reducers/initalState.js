import { StatusType } from '../common/enums';

const currentUser = null;
const items = [];
const initialStatus = {
  fetchStatus: StatusType.PENDING,
  newItemStatus: StatusType.RESOLVED
};

export { currentUser, items, initialStatus };
