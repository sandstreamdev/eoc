const {
  ItemActionTypes,
  ItemStatusType,
  CommentActionTypes,
  ListActionTypes
} = require('../common/variables');
const List = require('../models/list.model');
const Cohort = require('../models/cohort.model');
const { responseWithList } = require('../common/utils/helpers');

/* WS postfix stands for Web Socket, to differentiate
 * this from controllers naming convention
 */
const addItemToListWS = socket => {
  socket.on(ItemActionTypes.ADD_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.ADD_SUCCESS, data);
  });
};

const archiveItemWS = socket => {
  socket.on(ItemActionTypes.ARCHIVE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.ARCHIVE_SUCCESS, data);
  });
};

const deleteItemWS = socket => {
  socket.on(ItemActionTypes.DELETE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.DELETE_SUCCESS, data);
  });
};

const restoreItemWS = socket => {
  socket.on(ItemActionTypes.RESTORE_SUCCESS, data => {
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.RESTORE_SUCCESS, data);
  });
};

const updateItemState = socket => {
  socket.on(ItemStatusType.BUSY, data => {
    const { listId } = data;

    socket.broadcast.to(`sack-${listId}`).emit(ItemStatusType.BUSY, data);
  });

  socket.on(ItemStatusType.FREE, data => {
    const { listId } = data;

    socket.broadcast.to(`sack-${listId}`).emit(ItemStatusType.FREE, data);
  });
};

const updateItemWS = socket => {
  socket.on(ItemActionTypes.UPDATE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.UPDATE_SUCCESS, data)
  );
};

const addCommentWS = socket =>
  socket.on(CommentActionTypes.ADD_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(CommentActionTypes.ADD_SUCCESS, data)
  );

const cloneItemWS = socket =>
  socket.on(ItemActionTypes.CLONE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.CLONE_SUCCESS, data)
  );

const setVoteWS = socket =>
  socket.on(ItemActionTypes.SET_VOTE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.SET_VOTE_SUCCESS, data)
  );
const clearVoteWS = socket =>
  socket.on(ItemActionTypes.CLEAR_VOTE_SUCCESS, data =>
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.CLEAR_VOTE_SUCCESS, data)
  );

const markAsDoneWS = (socket, dashboardClients) => {
  socket.on(ItemActionTypes.TOGGLE_SUCCESS, data => {
    const { listId } = data;

    // send to users that are on the list view
    socket.broadcast
      .to(`sack-${data.listId}`)
      .emit(ItemActionTypes.TOGGLE_SUCCESS, data);

    List.findOne({
      _id: listId
    })
      .lean()
      .exec()
      .then(doc => {
        if (doc) {
          const { viewersIds, cohortId } = doc;

          if (dashboardClients.size > 0) {
            viewersIds.forEach(id => {
              const viewerId = id.toString();
              const list = responseWithList(doc, id);

              if (dashboardClients.has(viewerId)) {
                // send to users that are on the dashboard view
                socket.broadcast
                  .to(dashboardClients.get(viewerId))
                  .emit(ListActionTypes.CREATE_SUCCESS, list);
              }
            });
          }

          if (cohortId) {
            Cohort.findOne({ _id: cohortId })
              .lean()
              .exec()
              .then(cohort => {
                if (cohort) {
                  const { memberIds } = cohort;

                  memberIds.forEach(id => {
                    const currentList = responseWithList(doc, id);

                    // send to users that are on cohort view
                    socket.broadcast
                      .to(`cohort-${cohortId}`)
                      .emit(ListActionTypes.CREATE_SUCCESS, currentList);
                  });
                }
              });
          }
        }
      });
  });
};

module.exports = {
  addCommentWS,
  addItemToListWS,
  archiveItemWS,
  clearVoteWS,
  cloneItemWS,
  deleteItemWS,
  markAsDoneWS,
  restoreItemWS,
  setVoteWS,
  updateItemState,
  updateItemWS
};
