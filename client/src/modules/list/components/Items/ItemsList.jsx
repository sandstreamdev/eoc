import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import io from 'socket.io-client';
import _flowRight from 'lodash/flowRight';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import ListItem from 'modules/list/components/Items/ListItem';
import ListArchivedItem from 'modules/list/components/Items/ListArchivedItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import {
  IntlPropType,
  RouterMatchPropType,
  UserPropType
} from 'common/constants/propTypes';
import { ItemStatusType } from './model/actionTypes';
import { getCurrentUser } from 'modules/authorization/model/selectors';

const DISPLAY_LIMIT = 3;

class ItemsList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      busyItemId: '',
      busyBySomeoneItemId: '',
      limit: DISPLAY_LIMIT
    };

    this.socket = undefined;
  }

  componentDidMount() {
    this.handleSocketConnection();
    this.receiveWSEvents();
  }

  componentDidUpdate() {
    this.emitWSEvents();
  }

  componentWillUnmount() {
    const {
      match: {
        params: { id: listId }
      }
    } = this.props;

    this.socket.emit('leavingRoom', listId);

    // or disconnect from the socket here
  }

  emitWSEvents = () => {
    const { busyItemId } = this.state;
    const {
      match: {
        params: { id: listId }
      },
      currentUser: { id: userId }
    } = this.props;

    if (busyItemId) {
      this.socket.emit(ItemStatusType.BUSY, {
        itemId: busyItemId,
        listId,
        userId
      });
    }

    this.socket.emit(ItemStatusType.FREE, {
      itemId: busyItemId,
      listId,
      userId
    });
  };

  receiveWSEvents = () => {
    const {
      currentUser: { id: currentUserId }
    } = this.props;

    this.socket.on(ItemStatusType.BUSY, data => {
      const { itemId, userId } = data;

      if (currentUserId !== userId) {
        this.setState({ busyBySomeoneItemId: itemId });
      }
    });

    this.socket.on(ItemStatusType.FREE, data => {
      const { itemId, userId } = data;

      if (currentUserId !== userId) {
        this.setState({ busyBySomeoneItemId: itemId });
      }
    });
  };

  handleSocketConnection = () => {
    const {
      match: {
        params: { id: listId }
      }
    } = this.props;

    if (!this.socket) {
      this.socket = io();
    }

    this.socket = io();
    this.socket.on('connect', () =>
      this.socket.emit('joinRoom', `list-${listId}`)
    );
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  showLess = () => {
    this.setState({ limit: DISPLAY_LIMIT });
  };

  handleItemBusy = itemId => this.setState({ busyItemId: itemId });

  handleItemFree = () => this.setState({ busyItemId: '' });

  renderItems = () => {
    const { archived, isMember, items } = this.props;
    const { limit, busyBySomeoneItemId } = this.state;

    return archived ? (
      <ul className="items-list">
        {items.slice(0, limit).map(item => {
          const isItemBlocked = item._id === busyBySomeoneItemId;

          return (
            <ListArchivedItem
              blocked={isItemBlocked}
              data={item}
              isMember={isMember}
              key={item._id}
              onBusy={this.handleItemBusy}
              onFree={this.handleItemFree}
            />
          );
        })}
      </ul>
    ) : (
      <ul className="items-list">
        {items.slice(0, limit).map(item => {
          const isItemBlocked = item._id === busyBySomeoneItemId;

          return (
            <ListItem
              blocked={isItemBlocked}
              data={item}
              isMember={isMember}
              key={item._id}
              onBusy={this.handleItemBusy}
              onFree={this.handleItemFree}
            />
          );
        })}
      </ul>
    );
  };

  render() {
    const {
      archived,
      intl: { formatMessage },
      items
    } = this.props;
    const { limit } = this.state;

    return (
      <Fragment>
        {!items.length ? (
          <MessageBox
            message={
              archived
                ? formatMessage({ id: 'list.items-list.message-no-arch-items' })
                : formatMessage({ id: 'list.items-list.message-no-items' })
            }
            type={MessageType.INFO}
          />
        ) : (
          this.renderItems()
        )}
        {limit < items.length && (
          <button
            className="items__show-more"
            onClick={this.showMore}
            type="button"
          />
        )}
        {limit > DISPLAY_LIMIT && (
          <button
            className="items__show-less"
            onClick={this.showLess}
            type="button"
          />
        )}
      </Fragment>
    );
  }
}

ItemsList.propTypes = {
  archived: PropTypes.bool,
  currentUser: UserPropType.isRequired,
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  match: RouterMatchPropType.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(withRouter, injectIntl, connect(mapStateToProps))(
  ItemsList
);
