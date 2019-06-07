const ItemActivity = require('../models/activity.model');
const List = require('../models/list.model');

const saveItemActivity = (actionType, actorId, itemId, listId) => {
  const newActivity = new ItemActivity({
    actionType,
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
        const { itemId, createdAt, activityType } = doc;
        const { _id: actorId, avatarUrl, displayName } = doc.actorId;
        const {
          _id: listId,
          cohortId: cohort,
          name: listName,
          items
        } = doc.listId;
        const itemName = items.id(itemId).name;

        return {
          activityType,
          actor: { actorId, avatarUrl, displayName },
          cohort: cohort
            ? { cohortId: cohort._id, cohortName: cohort.name }
            : null,
          createdAt,
          item: { itemId, itemName },
          list: { listId, listName }
        };
      });

      resp.send(activities);
    })
    .catch(err => resp.sendStatus(400));
};

module.exports = { getActivities, saveItemActivity };
