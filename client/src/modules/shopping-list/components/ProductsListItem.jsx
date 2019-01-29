import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { PLACEHOLDER_URL } from 'common/constants/variables';
import VotingBox from 'modules/shopping-list/components/VotingBox';

const ProductListItem = ({
  archived,
  authorName,
  id,
  image = PLACEHOLDER_URL,
  name,
  toggleProduct,
  voteForProduct,
  votesCount,
  whetherUserVoted
}) => (
  <li
    className={classNames('products-list__item', {
      'products-list__item--blue': archived,
      'products-list__item--green': !archived
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
      onClick={() => toggleProduct(authorName, id, archived)}
    >
      <img alt="Product icon" className="products-list__icon" src={image} />
      <span className="products-list__data">
        <span>{name}</span>
        <span className="products-list__author">{`Ordered by: ${authorName}`}</span>
      </span>
      {!archived && (
        <VotingBox
          voteForProduct={voteForProduct}
          votesCount={votesCount}
          whetherUserVoted={whetherUserVoted}
        />
      )}
    </label>
  </li>
);

ProductListItem.propTypes = {
  archived: PropTypes.bool,
  authorName: PropTypes.string,
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  votesCount: PropTypes.number.isRequired,
  whetherUserVoted: PropTypes.bool.isRequired,

  toggleProduct: PropTypes.func,
  voteForProduct: PropTypes.func
};

export default ProductListItem;
