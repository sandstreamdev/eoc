import _orderBy from 'lodash/orderBy';
import _keyBy from 'lodash/keyBy';

export const getActivities = state => {
  const {
    activities: { data }
  } = state;

  return _keyBy(
    _orderBy(data, activity => new Date(activity.createdAt).getTime(), [
      'desc'
    ]),
    '_id'
  );
};
