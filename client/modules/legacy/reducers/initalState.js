import { StatusType } from 'common/constants/enums';

const items = [];
const initialStatus = {
  fetchStatus: StatusType.PENDING,
  newItemStatus: StatusType.RESOLVED
};

export { items, initialStatus };
