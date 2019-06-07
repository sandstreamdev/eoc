const Activity = require('../models/activity.model');
const List = require('../models/list.model');

const saveActivity = activityData => {
  const newActivity = new Activity({
    ...activityData
  });

  newActivity
    .save()
    .then(() =>
      List.find({ viewersIds: '5ce3bf74b556531f936d3d6a' }, '_id')
        .lean()
        .exec()
    )
    .then(lists => {
      if (!lists) {
        throw new Error();
      }
      return lists.map(list => list._id);
    })
    .then(listIds =>
      Activity.find(
        { listId: { $in: listIds } },
        {
          sort: { createdAt: -1 }
        }
      )
        .lean()
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
      console.log('***********************************');
      console.log(docs[0]);

      const activities = docs.map(doc => {
        const { _id: actorId, avatarUrl, displayName } = doc.actor;
        const { cohortId: cohort, name: listName, items } = doc.listId;
        const { _id, itemId, listId, createdAt, activityType } = doc;
        const itemName = items.id(itemId).name;

        return {
          activityType,
          actor: { actorId, avatarUrl, displayName },
          cohort: cohort
            ? { cohortId: cohort._id, name: cohort.cohortName }
            : null,
          createdAt,
          list: { listId, listName }
        };
      });
    })
    .catch(err => console.log(err));
};

const getItemActivities = (req, resp) => {
  const {
    user: { _id: userId }
  } = req;

  List.find({ viewersIds: userId }, '_id')
    .lean()
    .exec()
    .then(lists => lists.map(list => list._id))
    .then(listIds =>
      Activity.find(
        { listId: { $in: listIds } },
        {
          sort: { createdAt: -1 }
        }
      )
        .lean()
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
    );
};

module.exports = { getItemActivities, saveActivity };
