import _orderBy from 'lodash/orderBy';

export const getActivities = state => {
  const { activities } = state;

  return _orderBy(
    activities,
    activity => new Date(activity.createdAt).getTime(),
    ['desc']
  );
};
