import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProductsListItem from '../ProductsListItem';
import dispatchToggleItem from './actions';

class ProductsList extends Component {
  state = {
    limit: 3
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + 3 }));
  };

  toggleItem = (id, isOrdered) => {
    const { dispatchToggleItem } = this.props;
    dispatchToggleItem(id, isOrdered);
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
  dispatchToggleItem: PropTypes.func,
  isArchive: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object)
};

export default connect(
  null,
  { dispatchToggleItem }
)(ProductsList);
