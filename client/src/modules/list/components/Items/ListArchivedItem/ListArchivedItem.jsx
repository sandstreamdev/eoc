import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';
import classNames from 'classnames';

import PendingButton from 'common/components/PendingButton';
import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
import {
  deleteItem,
  restoreItem
} from 'modules/list/components/Items/model/actions';
import Confirmation from 'common/components/Confirmation';
import withSocket from 'common/hoc/withSocket';

class ListArchivedItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      busyBySomeone: false,
      busyInfoVisibility: false,
      isConfirmationVisible: false
    };
  }

  componentDidMount() {
    this.handleRoomConnection();
  }

  componentDidUpdate(prevProps) {
    const { blocked } = this.state;

    if (prevProps.blocked !== blocked) {
      this.handleBusyBySomeone();
    }
  }

  handleBusyBySomeone = () => {
    const { blocked } = this.props;

    this.setState({ busyBySomeone: blocked });
  };

  handleRestoringItem = event => {
    event.preventDefault();

    const {
      restoreItem,
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      },
      socket
    } = this.props;

    this.itemBusy();

    return restoreItem(listId, itemId, name, socket).finally(() =>
      this.itemFree()
    );
  };

  showConfirmation = event => {
    event.preventDefault();

    this.itemBusy();
    this.setState({ isConfirmationVisible: true });
  };

  hideConfirmation = () => {
    this.itemFree();
    this.setState({ isConfirmationVisible: false });
  };

  handleBusyBySomeone = () => {
    const { blocked } = this.props;

    this.setState({ busyBySomeone: blocked });
  };

  handleDeletingItem = () => {
    const {
      deleteItem,
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      },
      socket
    } = this.props;

    this.itemBusy();

    return deleteItem(listId, itemId, name, socket).finally(() =>
      this.itemFree()
    );
  };

  handleRoomConnection = () => {
    const {
      match: {
        params: { id: listId }
      },
      socket
    } = this.props;

    socket.emit('joinRoom', `list-${listId}`);
  };

  itemBusy = () => {
    const {
      onBusy,
      data: { _id: itemId }
    } = this.props;

    onBusy(itemId);
  };

  itemFree = () => {
    const { onFree } = this.props;

    onFree();
  };

  handleBusyInfoVisibility = event => {
    event.preventDefault();

    this.setState({ busyInfoVisibility: true });
  };

  renderBusyOverlay = () => {
    const { busyBySomeone, busyInfoVisibility } = this.state;

    return (
      busyBySomeone && (
        <div
          className={classNames('list-item__busy-overlay', {
            'list-item__busy-overlay--dimmed': busyInfoVisibility
          })}
          onClick={this.handleBusyInfoVisibility}
          onTouchEnd={this.handleBusyInfoVisibility}
          role="banner"
        >
          {busyInfoVisibility && (
            <FormattedMessage id="list.list-item.busy-info" />
          )}
        </div>
      )
    );
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
        {this.renderBusyOverlay()}
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
  blocked: PropTypes.bool,
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
  socket: PropTypes.objectOf(PropTypes.any),

  deleteItem: PropTypes.func.isRequired,
  onBusy: PropTypes.func.isRequired,
  onFree: PropTypes.func.isRequired,
  restoreItem: PropTypes.func.isRequired
};

export default _flowRight(
  withSocket,
  injectIntl,
  withRouter,
  connect(
    null,
    { deleteItem, restoreItem }
  )
)(ListArchivedItem);
