const sanitize = require('mongo-sanitize');

const Activity = require('../models/activity.model');
const List = require('../models/list.model');
const Cohort = require('../models/cohort.model');
const { NUMBER_OF_ACTIVITIES_TO_SEND } = require('../common/variables');

const saveActivity = (
  activityType,
  performerId,
  itemId = null,
  listId = null,
  cohortId = null,
  editedUserId = null,
  editedValue = null
) => {
  const newActivity = new Activity({
    activityType,
    performerId,
    cohortId,
    editedUserId,
    editedValue,
    itemId,
    listId
  });

  newActivity.save();
};

const getActivities = (req, resp) => {
  const { page } = req.params;
  const {
    user: { _id: userId }
  } = req;
  const sanitizedPage = +sanitize(page);
  let cohortIds;
  let listIds;
  let activitiesCount;

  if (!Number.isInteger(sanitizedPage) && sanitizedPage < 0) {
    return resp.sendStatus(400);
  }

  const skip = NUMBER_OF_ACTIVITIES_TO_SEND * (sanitizedPage - 1);

  Cohort.find({ memberIds: userId }, '_id')
    .lean()
    .exec()
    .then(cohorts => {
      cohortIds = cohorts.map(cohort => cohort._id);
    })
    .then(() =>
      List.find({ viewersIds: userId }, '_id')
        .lean()
        .exec()
    )
    .then(lists => {
      listIds = lists.map(list => list._id);
    })
    .then(() =>
      Activity.countDocuments({
        $or: [
          { listId: { $in: listIds } },
          { $and: [{ cohortId: { $in: cohortIds } }, { listId: null }] }
        ]
      })
    )
    .then(count => {
      activitiesCount = count;

      return Activity.find({
        $or: [
          { listId: { $in: listIds } },
          { $and: [{ cohortId: { $in: cohortIds } }, { listId: null }] }
        ]
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(NUMBER_OF_ACTIVITIES_TO_SEND)
        .populate('performerId', 'avatarUrl displayName')
        .populate('listId', 'name items')
        .populate('cohortId', 'name')
        .populate('editedUserId', 'displayName')
        .exec();
    })
    .then(docs => {
      if (!docs) {
        return resp.sendStatus(400);
      }
      const activities = docs.map(doc => {
        const {
          _id,
          activityType,
          performerId,
          cohortId,
          createdAt,
          editedValue,
          editedUserId,
          itemId,
          listId
        } = doc;

        const performer = performerId
          ? {
              id: performerId._id,
              avatarUrl: performerId.avatarUrl,
              name: performerId.displayName
            }
          : null;
        const cohort = cohortId
          ? { id: cohortId._id, name: cohortId.name }
          : null;
        const editedUser = editedUserId
          ? {
              id: editedUserId._id,
              avatarUrl: editedUserId.avatarUrl,
              name: editedUserId.displayName
            }
          : null;

        const list = listId ? { id: listId._id, name: listId.name } : null;
        const item = itemId ? { id: itemId } : null;

        if (item && listId) {
          const { items } = listId;
          const itemData = items.id(itemId);
          item.name = itemData ? itemData.name : null;
        }

        let adjustedActivityType = activityType;

        if (itemId && !item.name) {
          adjustedActivityType = `${adjustedActivityType}.no-item`;
        }

        return {
          _id,
          activityType: adjustedActivityType,
          performer,
          cohort,
          createdAt,
          editedValue,
          editedUser,
          item,
          list
        };
      });

      const nextPage = sanitizedPage + 1;

      const isNextPage =
        activitiesCount > NUMBER_OF_ACTIVITIES_TO_SEND * sanitizedPage;

      resp.send({ activities, isNextPage, nextPage });
    })
    .catch(() => resp.sendStatus(400));
};

module.exports = { getActivities, saveActivity };
