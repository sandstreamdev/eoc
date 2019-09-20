import { createSelector } from 'reselect';

const getAnimations = state => state.animations;

export const getAnimationForArchived = createSelector(
  getAnimations,
  animations => animations.animateArchivedItems
);

export const getAnimationForDone = createSelector(
  getAnimations,
  animations => animations.animateDoneItems
);

export const getAnimationForUnhandled = createSelector(
  getAnimations,
  animations a=> animations.animateUnhandledItems
);
