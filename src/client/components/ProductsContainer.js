import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProductsList from './ProductsList';

class ProductsContainer extends Component {
  constructor(props) {
    super(props);

    const { title, products, isArchive } = this.props;
    this.state = {
      title,
      products,
      isArchive
    };
  }

  render() {
    const { title, products, isArchive } = this.state;
    return (
      <div className="products">
        <header className="products__header">
          <h2 className="products__heading">{title}</h2>
          <span className="products__info">
            {isArchive ? 'Usuń z listy' : 'Oznacz zamówione'}
          </span>
        </header>

        <ProductsList products={products} isArchive={isArchive} />
      </div>
    );
  }
}

ProductsContainer.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  isArchive: PropTypes.bool.isRequired
};

export default ProductsContainer;
