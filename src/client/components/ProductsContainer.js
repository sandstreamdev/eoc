import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProductsList from './ProductsList';

class ProductsContainer extends Component {
  constructor(props) {
    super(props);

    const { title, products, isArchive } = this.props;
    this.state = {
      isArchive,
      products,
      title
    };
  }

  render() {
    const { title, products, isArchive } = this.state;
    return (
      <div className="products">
        <header className="products__header">
          <h2 className="products__heading">{title}</h2>
          <span className="products__info">
            {isArchive ? 'Remove item' : 'Mark as ordered'}
          </span>
        </header>

        <ProductsList isArchive={isArchive} products={products} />
      </div>
    );
  }
}

ProductsContainer.defaultProps = {
  isArchive: false
};

ProductsContainer.propTypes = {
  isArchive: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired
};

export default ProductsContainer;
