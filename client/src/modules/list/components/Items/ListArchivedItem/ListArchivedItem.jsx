import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import PendingButton from 'common/components/PendingButton';
import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
import {
  deleteItem,
  restoreItem
} from 'modules/list/components/Items/model/actions';
import Confirmation from 'common/components/Confirmation';

class ListArchivedItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isConfirmationVisible: false
    };
  }

  handleRestoringItem = event => {
    event.preventDefault();

    const {
      restoreItem,
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return restoreItem(listId, itemId, name);
  };

  showConfirmation = event => {
    event.preventDefault();

    this.setState({ isConfirmationVisible: true });
  };

  hideConfirmation = () => {
    this.setState({ isConfirmationVisible: false });
  };

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
              <FormattedMessage
                id={
                  isOrdered
                    ? 'list.list-archived-item.done'
                    : 'list.list-archived-item.unhandled'
                }
              />
            </div>
          </div>
          <div className="list-archived-item__features">
            <PendingButton
              className="link-button"
              onClick={this.handleRestoringItem}
              onTouchEnd={this.handleRestoringItem}
              type="button"
            >
              <FormattedMessage id="list.list-archived-item.restore" />
            </PendingButton>
            <button
              className="link-button"
              onClick={this.showConfirmation}
              onTouchEnd={this.showConfirmation}
              type="button"
            >
              <FormattedMessage id="list.list-archived-item.delete" />
            </button>
          </div>
        </div>
        {isConfirmationVisible && (
          <Confirmation
            disabled={!isMember}
            onCancel={this.hideConfirmation}
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

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    null,
    { deleteItem, restoreItem }
  )
)(ListArchivedItem);
