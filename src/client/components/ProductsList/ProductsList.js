import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import ProductsListItem from '../ProductsListItem';

class ProductsList extends Component {
  state = {
    limit: 3
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + 3 }));
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
  isArchive: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object)
};

export default ProductsList;
