import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const ProductListItem = ({ id, image, isArchive, name }) => {
  const itemStyle = classNames({
    'products-list__item': true,
    'products-list__item--red': isArchive,
    'products-list__item--green': !isArchive
  });

  return (
    <li className={itemStyle}>
      <input
        className="product-list__input"
        id={`option${id}`}
        name={`option${id}`}
        type="checkbox"
      />
      <label
        className="products-list__label"
        id={`option${id}`}
        htmlFor={`option${id}`}
      >
        <img src={image} alt="Product icon" className="products-list__icon" />
        {name}
      </label>
    </li>
  );
};

ProductListItem.propTypes = {
  id: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  isArchive: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired
};

export default ProductListItem;
