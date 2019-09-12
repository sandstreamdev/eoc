export const preventDispatchForPerformer = store => next => action => {
  if (typeof action !== 'function') {
    const { payload } = action;
    if (typeof payload === 'object') {
      const {
        payload: { performerId, ...rest },
        type
      } = action;
      const { currentUser: user } = store.getState();

      if (user && performerId && performerId === user.id) {
        return;
      }

      return next({
        type,
        payload: { ...rest }
      });
    }
  }

  return next(action);
};
