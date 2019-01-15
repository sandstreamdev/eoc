import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProductsListItem from '../ProductsListItem';
import { getCurrentUser } from '../../selectors';
import { toggle, vote } from './actions';
import { UserPropType } from '../../common/propTypes';

const DISPLAY_LIMIT = 3;

class ProductsList extends Component {
  state = {
    limit: DISPLAY_LIMIT
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  toggleItem = (author, id, isOrdered) => {
    const { toggle } = this.props;
    const {
      currentUser: { name }
    } = this.props;
    const isSameAuthor = author === name;

    if (isOrdered) {
      isSameAuthor ? toggle(id, isOrdered) : toggle(id, isOrdered, name);
    } else {
      toggle(id, isOrdered);
    }
  };

  voteForItem = item => () => {
    const { _id, votes } = item;
    const {
      vote,
      currentUser: { id }
    } = this.props;
    votes.includes(id)
      ? vote(_id, votes.filter(voterId => voterId !== id))
      : vote(_id, votes.concat(id));
  };

  render() {
    const {
      products,
      currentUser: { id: userId }
    } = this.props;
    const { limit } = this.state;

    return (
      <Fragment>
        {!products.length ? (
          <div className="products__message">
            <p>There are no items!</p>
          </div>
        ) : (
          <ul className="products-list">
            {products.slice(0, limit).map(item => (
              <ProductsListItem
                archived={item.isOrdered}
                author={item.author}
                id={item._id}
                image={item.image}
                key={item._id}
                name={item.name}
                toggleItem={this.toggleItem}
                voteForItem={this.voteForItem(item)}
                votesCount={item.votes.length}
                whetherUserVoted={item.votes.includes(userId)}
              />
            ))}
          </ul>
        )}
        {limit < products.length && (
          <button
            className="products__show-more"
            onClick={this.showMore}
            type="button"
          />
        )}
      </Fragment>
    );
  }
}

ProductsList.propTypes = {
  currentUser: UserPropType.isRequired,
  products: PropTypes.arrayOf(PropTypes.object),

  toggle: PropTypes.func,
  vote: PropTypes.func
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { toggle, vote }
)(ProductsList);
