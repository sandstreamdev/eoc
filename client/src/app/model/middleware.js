export const preventDispatchForPerformer = store => next => action => {
  if (typeof action === 'function' || !action.payload) {
    return next(action);
  }

  const {
    payload: { performerId, ...rest },
    type
  } = action;
  const { currentUser } = store.getState();

  if (currentUser && performerId && performerId === currentUser.id) {
    return;
  }

  return next({
    type,
    payload: { ...rest }
  });
};
