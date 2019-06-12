const Activity = require('../models/activity.model');
const List = require('../models/list.model');
const Cohort = require('../models/cohort.model');

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
  const {
    user: { _id: userId }
  } = req;
  let cohortIds;
  let listIds;

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
      Activity.find({
        $or: [{ listId: { $in: listIds } }, { cohortId: { $in: cohortIds } }]
      })
        .sort({ createdAt: -1 })
        .populate('performerId', 'avatarUrl displayName')
        .populate('listId', 'name items')
        .populate('cohortId', 'name')
        .populate('editedUserId', 'displayName')
        .exec()
    )
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
              performerId: performerId._id,
              performerAvatarUrl: performerId.avatarUrl,
              performerName: performerId.displayName
            }
          : null;
        const cohort = cohortId
          ? { cohortId: cohortId._id, cohortName: cohortId.name }
          : null;
        const editedUser = editedUserId
          ? {
              editedUserId: editedUserId._id,
              editedUserAvatarUrl: editedUserId.avatarUrl,
              editedUserName: editedUserId.displayName
            }
          : null;

        const list = listId
          ? { listId: listId._id, listName: listId.name }
          : null;
        const item = { itemId };

        if (listId) {
          const { items } = listId;
          const itemData = items.id(itemId);
          item.itemName = itemData ? itemData.name : null;
        }

        return {
          _id,
          activityType,
          performer,
          cohort,
          createdAt,
          editedValue,
          editedUser,
          item,
          list
        };
      });

      resp.send(activities);
    })
    .catch(() => resp.sendStatus(400));
};

module.exports = { getActivities, saveActivity };
