import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import PendingButton from 'common/components/PendingButton';
import { RouterMatchPropType } from 'common/constants/propTypes';
import {
  deleteItem,
  restoreItem
} from 'modules/list/components/Items/model/actions';
import Confirmation from 'common/components/Confirmation';

class ListArchivedItem extends PureComponent {
  state = {
    isConfirmationVisible: false
  };

  handleRestoringItem = () => {
    const {
      restoreItem,
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return restoreItem(listId, itemId);
  };

  handleConfirmationVisibility = () =>
    this.setState(({ isConfirmationVisible }) => ({
      isConfirmationVisible: !isConfirmationVisible
    }));

  handleDeletingItem = () => {
    const {
      deleteItem,
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return deleteItem(listId, itemId);
  };

  render() {
    const {
      data: { authorName, name, isOrdered, votesCount },
      isMember
    } = this.props;
    const { isConfirmationVisible } = this.state;

    return (
      <li className="list-archived-item">
        <div className="list-archived-item__wrapper">
          <div className="list-archived-item__data">
            <span className="list-archived-item__name">{name}</span>
            <span className="list-archived-item__author">{`Added by: ${authorName}`}</span>
            <div className="list-archived-item__details">
              <span>archived</span>
              <span>{`votes: ${votesCount}`}</span>
              <span>{isOrdered ? 'Done' : 'Unhandled'}</span>
            </div>
          </div>
          <div className="list-archived-item__features">
            <PendingButton
              className="link-button"
              onClick={this.handleRestoringItem}
              type="button"
            >
              restore
            </PendingButton>
            <button
              className="link-button"
              onClick={this.handleConfirmationVisibility}
              type="button"
            >
              delete
            </button>
          </div>
        </div>
        {isConfirmationVisible && (
          <Confirmation
            disabled={!isMember}
            onCancel={this.handleConfirmationVisibility}
            onConfirm={this.handleDeletingItem}
            title={`Do you really want to delete "${name}" item?`}
          />
        )}
      </li>
    );
  }
}

ListArchivedItem.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object
    ])
  ),
  isMember: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  deleteItem: PropTypes.func.isRequired,
  restoreItem: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { deleteItem, restoreItem }
  )(ListArchivedItem)
);
