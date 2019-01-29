import { StatusType } from 'common/constants/enums';

const products = [];
const initialStatus = {
  fetchStatus: StatusType.PENDING,
  newProductStatus: StatusType.RESOLVED
};

export { products, initialStatus };
