import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { PLACEHOLDER_URL } from 'common/constants/variables';
import VotingBox from 'modules/list/components/VotingBox';

class ItemsListItem extends PureComponent {
  constructor(props) {
    super(props);
    const { archived } = this.props;
    this.state = { done: archived };
  }

  handleItemToggling = (authorName, id, archived) => () => {
    const { done } = this.state;
    this.setState({ done: !done });
    const { toggleItem } = this.props;
    toggleItem(authorName, id, archived);
  };

  handleItemChange = () => {
    const { done } = this.state;
    this.setState({ done: !done });
  };

  render() {
    const {
      archived,
      authorName,
      id,
      image = PLACEHOLDER_URL,
      name,
      voteForItem,
      votesCount,
      whetherUserVoted
    } = this.props;
    const { done } = this.state;
    return (
      <li
        className={classNames('items-list__item', {
          'items-list__item--restore': !done && archived,
          'items-list__item--done': done || archived
        })}
      >
        <input
          className="item-list__input"
          id={`option${id}`}
          name={`option${id}`}
          type="checkbox"
        />
        <label
          className="items-list__label"
          htmlFor={`option${id}`}
          id={`option${id}`}
          onClick={this.handleItemToggling(authorName, id, archived)}
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
  }
}

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
