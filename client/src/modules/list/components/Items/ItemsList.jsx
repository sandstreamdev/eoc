import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { pipe } from '@sandstreamdev/std/function';

import ListItem from 'modules/list/components/Items/ListItem';
import ListArchivedItem from 'modules/list/components/Items/ListArchivedItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import { disableItemAnimations } from './model/actions';
import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
import { updateLimit } from 'modules/list/model/actions';
import { DISPLAY_LIMIT } from 'common/constants/variables';
import { ChevronDown, ChevronUp } from 'assets/images/icons';

class ItemsList extends PureComponent {
  state = {
    limit: DISPLAY_LIMIT
  };

  componentDidMount() {
    this.updateDisplayItemsCount();
    this.handleLimitUpdate();
  }

  componentDidUpdate(previousProps) {
    const { items: previousItems } = previousProps;
    const { items } = this.props;

    if (previousItems.length !== items.length) {
      this.updateDisplayItemsCount();
      this.handleLimitUpdate();
    }
  }

  /**
   * Do not remove handleLimitUpdate method,
   * it is necessary for animations to work
   */
  handleLimitUpdate = () => {
    const {
      archived: archivedItems,
      done: doneItems,
      match: {
        params: { id: listId }
      },
      updateLimit
    } = this.props;
    const { limit: currentLimit } = this.state;
    const limit = {};

    if (archivedItems) {
      limit.archivedLimit = currentLimit;
    } else if (doneItems) {
      limit.doneLimit = currentLimit;
    } else {
      limit.unhandledLimit = currentLimit;
    }

    updateLimit(limit, listId);
  };

  updateDisplayItemsCount = () => {
    const { onUpdateItemsCount, items } = this.props;
    const { limit } = this.state;
    const displayedItemsCount = Math.min(items.length, limit);

    onUpdateItemsCount(displayedItemsCount);
  };

  showMore = () =>
    this.setState(
      ({ limit }) => ({ limit: limit + DISPLAY_LIMIT }),
      this.updateDisplayItemsCount
    );

  showLess = () =>
    this.setState({ limit: DISPLAY_LIMIT }, this.updateDisplayItemsCount);

  handleDisableAnimations = item => () => {
    const { _id: itemId, animate } = item;
    if (animate) {
      const {
        disableItemAnimations,
        match: {
          params: { id: listId }
        }
      } = this.props;

      disableItemAnimations(itemId, listId);
    }
  };

  renderItems = () => {
    const { archived, isMember, items } = this.props;
    const { limit } = this.state;

    if (!items) {
      return null;
    }

    return archived ? (
      <ul className="items-list">
        <TransitionGroup component={null}>
          {items.slice(0, limit).map(item => (
            <CSSTransition
              classNames="animated-item"
              enter={item.animate}
              exit={item.animate}
              key={item._id}
              onEntered={this.handleDisableAnimations(item)}
              timeout={1000}
            >
              <ListArchivedItem
                data={item}
                isMember={isMember}
                key={item._id}
              />
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ul>
    ) : (
      <ul className="items-list">
        <TransitionGroup component={null}>
          {items.slice(0, limit).map(item => (
            <CSSTransition
              classNames="animated-item"
              enter={item.animate}
              exit={item.animate}
              key={item._id}
              onEntered={this.handleDisableAnimations(item)}
              timeout={2000}
            >
              <ListItem data={item} isMember={isMember} key={item._id} />
            </CSSTransition>
          ))}
        </TransitionGroup>
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
    const messageId = archived
      ? 'list.items-list.message-no-arch-items'
      : 'list.items-list.message-no-items';

    return (
      <Fragment>
        {!items.length && (
          <MessageBox type={MessageType.INFO}>
            <FormattedMessage id={messageId} />
          </MessageBox>
        )}
        {this.renderItems()}
        {limit < items.length && (
          <button
            className="items__show-more"
            onClick={this.showMore}
            title={formatMessage({ id: 'common.show-more' })}
            type="button"
          >
            <FormattedMessage id="common.show-more" />
            <ChevronDown />
          </button>
        )}
        {limit > DISPLAY_LIMIT && items.length > 3 && (
          <button
            className="items__show-less"
            onClick={this.showLess}
            title={formatMessage({ id: 'common.show-less' })}
            type="button"
          >
            <FormattedMessage id="common.show-less" />
            <ChevronUp />
          </button>
        )}
      </Fragment>
    );
  }
}

ItemsList.propTypes = {
  archived: PropTypes.bool,
  done: PropTypes.bool,
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,

  disableItemAnimations: PropTypes.func.isRequired,
  onUpdateItemsCount: PropTypes.func.isRequired,
  updateLimit: PropTypes.func.isRequired
};

export default pipe(
  injectIntl,
  withRouter,
  connect(
    null,
    { disableItemAnimations, updateLimit }
  )
)(ItemsList);
