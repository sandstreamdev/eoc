import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import ListItem from 'modules/list/components/ListItem';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { toggle, vote } from './actions';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';

const DISPLAY_LIMIT = 3;

class ItemsList extends Component {
  state = {
    limit: DISPLAY_LIMIT
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  toggleItem = (author, id, isOrdered) => {
    const {
      toggle,
      match: {
        params: { id: listId }
      }
    } = this.props;
    const {
      currentUser: { name }
    } = this.props;
    const isSameAuthor = author === name;

    if (isOrdered) {
      isSameAuthor
        ? toggle(isOrdered, id, listId)
        : toggle(isOrdered, id, listId, name);
    } else {
      toggle(isOrdered, id, listId);
    }
  };

  voteForItem = item => () => {
    const { _id, voterIds } = item;
    const {
      vote,
      currentUser: { id },
      match: {
        params: { id: listId }
      }
    } = this.props;
    voterIds.includes(id)
      ? vote(_id, listId, voterIds.filter(voterId => voterId !== id))
      : vote(_id, listId, voterIds.concat(id));
  };

  render() {
    const {
      items,
      currentUser: { id: userId }
    } = this.props;
    const { limit } = this.state;

    return (
      <Fragment>
        {!items.length ? (
          <div className="items__message">
            <p>There are no items!</p>
          </div>
        ) : (
          <ul className="items-list">
            {items.slice(0, limit).map(item => (
              <ListItem
                archived={item.isOrdered}
                authorName={item.authorName}
                id={item._id}
                image={item.image}
                key={item._id}
                name={item.name}
                toggleItem={this.toggleItem}
                voteForItem={this.voteForItem(item)}
                votesCount={item.voterIds.length}
                whetherUserVoted={item.voterIds.includes(userId)}
              />
            ))}
          </ul>
        )}
        {limit < items.length && (
          <button
            className="items__show-more"
            onClick={this.showMore}
            type="button"
          />
        )}
      </Fragment>
    );
  }
}

ItemsList.propTypes = {
  currentUser: UserPropType.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,

  toggle: PropTypes.func,
  vote: PropTypes.func
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { toggle, vote }
  )(ItemsList)
);
