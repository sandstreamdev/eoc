import React from 'react';
import PropTypes from 'prop-types';

import ProductsList from './ProductsList';

const ProductsContainer = ({ isArchive, products }) => (
  <div className="products">
    <header className="products__header">
      <h2 className="products__heading">
        {isArchive ? 'Orders history' : 'Products list'}
      </h2>
      <span className="products__info">
        {isArchive ? 'Restore item' : 'Mark as ordered'}
      </span>
    </header>
    {!products.length && (
      <div className="products__message">
        <p>There are no items!</p>
      </div>
    )}
    <ProductsList isArchive={isArchive} products={products} />
  </div>
);

ProductsContainer.propTypes = {
  isArchive: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object)
};

export default ProductsContainer;
