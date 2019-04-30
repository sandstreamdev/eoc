import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import ListItem from 'modules/list/components/Items/ListItem';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { toggle, clearVote, setVote } from './model/actions';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';

const DISPLAY_LIMIT = 3;

class ItemsList extends Component {
  state = {
    limit: DISPLAY_LIMIT
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  toggleItem = (authorId, id, isOrdered) => {
    const {
      isMember,
      toggle,
      match: {
        params: { id: listId }
      }
    } = this.props;
    const {
      currentUser: { name, id: userId }
    } = this.props;

    if (isMember) {
      const isSameAuthor = authorId === userId;

      isSameAuthor
        ? toggle(isOrdered, id, listId, name)
        : toggle(isOrdered, id, listId);
    }
  };

  voteForItem = item => () => {
    const { _id, isVoted } = item;
    const {
      clearVote,
      isMember,
      setVote,
      match: {
        params: { id: listId }
      }
    } = this.props;

    if (isMember) {
      const action = isVoted ? clearVote : setVote;
      action(_id, listId);
    }
  };

  render() {
    const { isMember, items } = this.props;
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
                data={item}
                isMember={isMember}
                key={item._id}
                toggleItem={this.toggleItem}
                voteForItem={this.voteForItem(item)}
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
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,

  clearVote: PropTypes.func,
  setVote: PropTypes.func,
  toggle: PropTypes.func
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { toggle, clearVote, setVote }
  )(ItemsList)
);
