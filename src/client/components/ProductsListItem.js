import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ProductListItem = ({ id, image, isArchive, name }) => (
  <li
    className={classNames({
      'products-list__item': true,
      'products-list__item--red': isArchive,
      'products-list__item--green': !isArchive
    })}
  >
    <input
      className="product-list__input"
      id={`option${id}`}
      name={`option${id}`}
      type="checkbox"
    />
    <label
      className="products-list__label"
      htmlFor={`option${id}`}
      id={`option${id}`}
    >
      <img alt="Product icon" className="products-list__icon" src={image} />
      {name}
    </label>
  </li>
);

ProductListItem.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  isArchive: PropTypes.bool,
  name: PropTypes.string.isRequired
};

export default ProductListItem;
