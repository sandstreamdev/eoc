import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProductsListItem from '../ProductsListItem';
import VotingBox from '../VotingBox';
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

  voteForItem = (itemId, votes) => {
    const {
      vote,
      currentUser: { id }
    } = this.props;
    if (votes.includes(id)) {
      vote(itemId, votes.filter(voterId => voterId !== id));
    } else {
      vote(itemId, votes.concat(id));
    }
  };

  render() {
    const { products } = this.props;
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
              <li key={item._id}>
                {!item.isOrdered && (
                  <VotingBox
                    id={item._id}
                    votes={item.votes}
                    votesNumber={item.votes.length}
                    voteForItem={this.voteForItem}
                  />
                )}
                <ProductsListItem
                  archived={item.isOrdered}
                  author={item.author}
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  toggleItem={this.toggleItem}
                />
              </li>
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
