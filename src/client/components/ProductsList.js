import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

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
            <li
              key={item.name}
              className={`products-list__item ${
                isArchive
                  ? 'products-list__item--red'
                  : 'products-list__item--green'
              }`}
            >
              <input
                className="product-list__input"
                id={`option${item.id}`}
                name={`option${item.id}`}
                type="checkbox"
              />
              <label
                className="products-list__label"
                id={`option${item.id}`}
                htmlFor={`option${item.id}`}
              >
                <img
                  src="src/client/assets/images/placeholder.png"
                  alt="Product icon"
                  className="products-list__icon"
                />
                {item.name}
              </label>
            </li>
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
