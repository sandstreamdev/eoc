import { StatusType } from '../common/enums';

const items = [];
const initialStatus = {
  fetchStatus: StatusType.PENDING,
  newItemStatus: StatusType.RESOLVED
};

export { items, initialStatus };
