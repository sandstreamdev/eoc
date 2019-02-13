import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import ProductsListItem from 'modules/shopping-list/components/ProductsListItem';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { toggle, vote } from './actions';
import { UserPropType } from 'common/constants/propTypes';

const DISPLAY_LIMIT = 3;

class ProductsList extends Component {
  state = {
    limit: DISPLAY_LIMIT
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  toggleProduct = (author, id, isOrdered) => {
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

  voteForProduct = product => () => {
    const { _id, voterIds } = product;
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
            {products.slice(0, limit).map(product => (
              <ProductsListItem
                archived={product.isOrdered}
                authorName={product.authorName}
                id={product._id}
                image={product.image}
                key={product._id}
                name={product.name}
                toggleProduct={this.toggleProduct}
                voteForProduct={this.voteForProduct(product)}
                votesCount={product.voterIds.length}
                whetherUserVoted={product.voterIds.includes(userId)}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,
  products: PropTypes.arrayOf(PropTypes.object),

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
  )(ProductsList)
);
