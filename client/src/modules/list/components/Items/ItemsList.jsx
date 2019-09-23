import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import _flowRight from 'lodash/flowRight';

import ListItem from 'modules/list/components/Items/ListItem';
import ListArchivedItem from 'modules/list/components/Items/ListArchivedItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import { disableItemAnimations } from './model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import { updateLimit } from 'modules/list/model/actions';

export const DISPLAY_LIMIT = 3;

class ItemsList extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      limit: DISPLAY_LIMIT
    };
  }

  showMore = () =>
    this.setState(
      ({ limit }) => ({ limit: limit + DISPLAY_LIMIT }),
      this.handleLimitUpdate
    );

  showLess = () =>
    this.setState({ limit: DISPLAY_LIMIT }, this.handleLimitUpdate);

  handleDisableAnimations = item => () => {
    if (item.animate) {
      const {
        disableItemAnimations,
        match: {
          params: { id: listId }
        }
      } = this.props;

      disableItemAnimations({ itemId: item._id, listId });
    }
  };

  handleLimitUpdate = () => {
    const {
      archived: archivedItemsList,
      done: doneItemsList,
      match: {
        params: { id: listId }
      },
      updateLimit
    } = this.props;
    const { limit: currentLimit } = this.state;
    const limit = {};

    if (archivedItemsList) {
      limit.archivedLimit = currentLimit;
    } else if (doneItemsList) {
      limit.doneLimit = currentLimit;
    } else {
      limit.unhandledLimit = currentLimit;
    }

    updateLimit({ listId, limit });
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
              enter={item.animate === true}
              exit={item.animate}
              classNames="animated-item"
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
              enter={item.animate === true}
              exit={item.animate}
              classNames="animated-item"
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
    const { archived, items } = this.props;
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
            type="button"
          />
        )}
        {limit > DISPLAY_LIMIT && items.length > 3 && (
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
  done: PropTypes.bool,
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,

  disableItemAnimations: PropTypes.func.isRequired,
  updateLimit: PropTypes.func.isRequired
};

export default _flowRight(
  withRouter,
  connect(
    null,
    { disableItemAnimations, updateLimit }
  )
)(ItemsList);
