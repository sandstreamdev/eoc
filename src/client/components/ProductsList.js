import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import ProductsListItem from './ProductsListItem';

class ProductsList extends Component {
  state = {
    limit: 3
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + 3 }));
  };

  render() {
    const { products, isArchive } = this.props;
    const { limit } = this.state;

    return (
      <Fragment>
        <ul className="products-list">
          {products.slice(0, limit).map(item => (
            <ProductsListItem
              id={item.id}
              image={item.image}
              isArchive={isArchive}
              key={item.name}
              name={item.name}
            />
          ))}
        </ul>

        {isArchive && limit < products.length && (
          <button
            className="products__show-more"
            type="button"
            onClick={this.showMore}
          />
        )}
      </Fragment>
    );
  }
}

ProductsList.propTypes = {
  isArchive: PropTypes.bool.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default ProductsList;
