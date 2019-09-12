export const preventDispatchForPerformer = store => next => action => {
  if (action.payload) {
    const {
      payload: { performerId, ...rest },
      type
    } = action;
    const { currentUser: user } = store.getState();

    if (user && performerId === user.id) {
      return;
    }

    return next({ type, payload: { ...rest } });
  }

  return next(action);
};
