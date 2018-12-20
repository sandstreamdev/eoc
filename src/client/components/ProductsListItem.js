import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { PLACEHOLDER_URL } from '../common/variables';

const ProductListItem = ({
  author,
  id,
  image = PLACEHOLDER_URL,
  isArchive,
  name,
  toggleItem
}) => (
  <li
    className={classNames({
      'products-list__item': true,
      'products-list__item--blue': isArchive,
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
      onClick={() => toggleItem(author, id, isArchive)}
    >
      <img alt="Product icon" className="products-list__icon" src={image} />
      <span className="products-list__data">
        <span>{name}</span>
        <span className="products-list__author">
          Ordered by:&nbsp;
          {author}
        </span>
      </span>
    </label>
  </li>
);

ProductListItem.propTypes = {
  author: PropTypes.string,
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  isArchive: PropTypes.bool,
  name: PropTypes.string.isRequired,
  toggleItem: PropTypes.func
};

export default ProductListItem;
