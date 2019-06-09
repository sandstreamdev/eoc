const ItemActivity = require('../models/activity.model');
const List = require('../models/list.model');

const saveItemActivity = (activityType, actorId, itemId, listId) => {
  const newActivity = new ItemActivity({
    activityType,
    actorId,
    itemId,
    listId
  });

  newActivity.save();
};

const getActivities = (req, resp) => {
  const {
    user: { _id: userId }
  } = req;

  List.find({ viewersIds: userId }, '_id')
    .lean()
    .exec()
    .then(lists => {
      if (!lists) {
        throw new Error();
      }

      return lists.map(list => list._id);
    })
    .then(listIds =>
      ItemActivity.find({ listId: { $in: listIds } })
        .sort({ createdAt: -1 })
        .populate('actorId', '_id avatarUrl displayName')
        .populate({
          path: 'listId',
          select: {
            _id: 1,
            name: 1,
            items: 1
          },
          populate: { path: 'cohortId', select: '_id name' }
        })
        .exec()
    )
    .then(docs => {
      if (!docs) {
        throw new Error();
      }

      const activities = docs.map(doc => {
        const {
          _id,
          activityType,
          actorId,
          createdAt,
          itemId,
          listId,
          listId: { cohortId, items }
        } = doc;
        const itemData = items.id(itemId);
        const actor = actorId
          ? {
              actorId: actorId._id,
              actorAvatarUrl: actorId.avatarUrl,
              actorName: actorId.displayName
            }
          : null;
        const cohort = cohortId
          ? { cohortId: cohortId._id, cohortName: cohortId.name }
          : null;
        const list = listId
          ? { listId: listId._id, listName: listId.name }
          : null;
        const item = { itemId, itemName: itemData ? itemData.name : null };

        return {
          _id,
          activityType,
          actor,
          cohort,
          createdAt,
          item,
          list
        };
      });

      resp.send(activities);
    })
    .catch(err => resp.sendStatus(400));
};

module.exports = { getActivities, saveItemActivity };
