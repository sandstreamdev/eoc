import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { PLACEHOLDER_URL } from 'common/constants/variables';
import VotingBox from 'modules/list/components/VotingBox';

const ItemsListItem = ({
  archived,
  authorName,
  id,
  image = PLACEHOLDER_URL,
  name,
  toggleItem,
  voteForItem,
  votesCount,
  whetherUserVoted
}) => (
  <li
    className={classNames('items-list__item', {
      // 'items-list__item--blue': !archived,
      'items-list__item--green': archived
    })}
  >
    <input
      className="item-list__input"
      id={`option${id}`}
      name={`option${id}`}
      type="checkbox"
      checked={archived}
    />
    <label
      className="items-list__label"
      htmlFor={`option${id}`}
      id={`option${id}`}
      onClick={() => toggleItem(authorName, id, archived)}
    >
      <img alt="Item icon" className="items-list__icon" src={image} />
      <span className="items-list__data">
        <span>{name}</span>
        <span className="items-list__author">{`Added by: ${authorName}`}</span>
      </span>
      {!archived && (
        <VotingBox
          voteForItem={voteForItem}
          votesCount={votesCount}
          whetherUserVoted={whetherUserVoted}
        />
      )}
    </label>
  </li>
);

ItemsListItem.propTypes = {
  archived: PropTypes.bool,
  authorName: PropTypes.string,
  id: PropTypes.string.isRequired,
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
  votesCount: PropTypes.number.isRequired,
  whetherUserVoted: PropTypes.bool.isRequired,

  toggleItem: PropTypes.func,
  voteForItem: PropTypes.func
};

export default ItemsListItem;
