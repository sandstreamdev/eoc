import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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

  voteForProduct = product => () => {
    console.log(product);
    const { _id, voterIds } = product;
    const {
      vote,
      currentUser: { id }
    } = this.props;
    voterIds.includes(id)
      ? vote(_id, voterIds.filter(voterId => voterId !== id))
      : vote(_id, voterIds.concat(id));
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
            <p>There are no products!</p>
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
