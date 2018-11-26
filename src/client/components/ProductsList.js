import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      limit: 3
    };
  }

  showMore = () => {
    const { limit } = this.state;
    this.setState({ limit: limit + 3 });
  };

  render() {
    const { products, isArchive } = this.props;
    const { limit } = this.state;
    return (
      <React.Fragment>
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
                  src={item.image}
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
      </React.Fragment>
    );
  }
}

ProductsList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  isArchive: PropTypes.bool.isRequired
};

export default ProductsList;
