import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';

import PendingButton from 'common/components/PendingButton';
import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
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
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return restoreItem(listId, itemId, name);
  };

  handleConfirmationVisibility = () =>
    this.setState(({ isConfirmationVisible }) => ({
      isConfirmationVisible: !isConfirmationVisible
    }));

  handleDeletingItem = () => {
    const {
      deleteItem,
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return deleteItem(listId, itemId, name);
  };

  render() {
    const {
      data: { authorName, name, isOrdered, votesCount },
      intl: { formatMessage },
      isMember
    } = this.props;
    const { isConfirmationVisible } = this.state;

    return (
      <li className="list-archived-item">
        <div className="list-archived-item__wrapper">
          <div className="list-archived-item__data">
            <span className="list-archived-item__name">{name}</span>
            <span className="list-archived-item__author">
              <FormattedMessage
                id="list.list-archived-item.author"
                values={{ authorName }}
              />
            </span>
            <div className="list-archived-item__details">
              <FormattedMessage id="list.list-archived-item.archived" />
              <span>
                {formatMessage(
                  {
                    id: 'list.list-archived-item.votes-count'
                  },
                  { votesCount }
                )}
              </span>
              {isOrdered ? (
                <FormattedMessage id="list.list-archived-item.done" />
              ) : (
                <FormattedMessage id="list.list-archived-item.unhandled" />
              )}
            </div>
          </div>
          <div className="list-archived-item__features">
            <PendingButton
              className="link-button"
              onClick={this.handleRestoringItem}
              type="button"
            >
              <FormattedMessage id="list.list-archived-item.restore" />
            </PendingButton>
            <button
              className="link-button"
              onClick={this.handleConfirmationVisibility}
              type="button"
            >
              <FormattedMessage id="list.list-archived-item.delete" />
            </button>
          </div>
        </div>
        {isConfirmationVisible && (
          <Confirmation
            disabled={!isMember}
            onCancel={this.handleConfirmationVisibility}
            onConfirm={this.handleDeletingItem}
            title={formatMessage(
              {
                id: 'list.list-archived-item.confirmation'
              },
              { name }
            )}
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
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  deleteItem: PropTypes.func.isRequired,
  restoreItem: PropTypes.func.isRequired
};

export default injectIntl(
  withRouter(
    connect(
      null,
      { deleteItem, restoreItem }
    )(ListArchivedItem)
  )
);
