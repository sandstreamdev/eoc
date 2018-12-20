import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProductsListItem from '../ProductsListItem';
import dispatchToggleItem from './actions';
import { getCurrentUser } from '../../selectors';

class ProductsList extends Component {
  state = {
    limit: 3
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + 3 }));
  };

  toggleItem = (author, id, isOrdered) => {
    const { dispatchToggleItem } = this.props;
    const {
      currentUser: { name }
    } = this.props;

    /**
     * If an item was ordered, check item author
     * and update author if neccessary to point
     * who is ordering this time.
     */
    !isOrdered
      ? dispatchToggleItem(id, isOrdered)
      : author !== name
      ? dispatchToggleItem(id, isOrdered, name)
      : dispatchToggleItem(id, isOrdered);
  };

  render() {
    const { isArchive, products } = this.props;
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
                author={item.author}
                id={item._id}
                image={item.image}
                isArchive={isArchive}
                key={item._id}
                name={item.name}
                toggleItem={this.toggleItem}
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
  currentUser: PropTypes.objectOf(PropTypes.string),
  isArchive: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object),

  dispatchToggleItem: PropTypes.func
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { dispatchToggleItem }
)(ProductsList);
