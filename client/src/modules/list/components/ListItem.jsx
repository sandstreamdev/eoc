import React, { Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import VotingBox from 'modules/list/components/VotingBox';

class ListItem extends PureComponent {
  constructor(props) {
    super(props);
    const { archived } = this.props;
    this.state = { done: archived, areDetailsVisible: false };
  }

  handleItemToggling = (authorName, id, archived) => () => {
    const { done } = this.state;
    this.setState({ done: !done });
    const { toggleItem } = this.props;
    toggleItem(authorName, id, archived);
  };

  showDetails = () => this.setState({ areDetailsVisible: true });

  hideDetails = () => this.setState({ areDetailsVisible: false });

  renderDetails = () => {
    
    const{areDetailsVisible} = this.state;

    return (
      <Fragment>
        <div className="list-item__info">
      
          <textarea
            className="list-item__textarea primary-textarea"
            placeholder="Description"
          />
          <div className="list-item__info-details">
            <input type="number" placeholder="Enter a price" min="0" max="10000" step="1"  name="price"  />
            <input
              type="text"
              className="list-item__link primary-input"
              placeholder="Add link to item"
            />
          </div>
        </div>
        <div className="list-item__add-comment">
          <button className="list-item__button link-button" type="button">
            Add comment
          </button>

          <textarea
            className="list-item__textarea primary-textarea"
            placeholder="Add comment"
          />
          <button className="list-item__button primary-button" type="button">
            Add comment
          </button>
        </div>
        <div className="list-item__comments">
          <h2 className="list-item__heading">Comments</h2>
          <div className="list-item__comment">
            <img src="" alt="" className="list-item__comment-avatar" />
            <div className="list-item__comment-body">
              <span className="list-item__comment-name">Adam Klepacz</span>
              <p className="list-item__comment-content">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Excepturi voluptatem vitae qui nihil reprehenderit quia nam
                accusantium nobis. Culpa ducimus aspernatur ea libero! Nobis
                ipsam, molestiae similique optio sint hic!
              </p>
            </div>
            <div className="list-item__comment-body">
              <span className="list-item__comment-name">Adam Klepacz</span>
              <p className="list-item__comment-content">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Excepturi voluptatem vitae qui nihil reprehenderit quia nam
                accusantium nobis. Culpa ducimus aspernatur ea libero! Nobis
                ipsam, molestiae similique optio sint hic!
              </p>
            </div>
          </div>
        </div>
        <footer className="list-item__footer">
          <button
            className="list-item__hide"
            type="button"
            onClick={this.hideDetails}
          >
            hide info
          </button>
        </footer>
      </Fragment>
    );
  };

  render() {
    const {
      archived,
      authorName,
      id,
      isVoted,
      name,
      voteForItem,
      votesCount
    } = this.props;
    const { done, areDetailsVisible } = this.state;
    return (
      <li
        className={classNames('list-item', {
          'list-item--restore': !done && archived,
          'list-item--done': done || archived
        })}
      >
        <div className="list-item__top">
          <input
            className="list-item__input"
            id={`option${id}`}
            name={`option${id}`}
            type="checkbox"
          />
          <label
            className="list-item__label"
            htmlFor={`option${id}`}
            id={`option${id}`}
            onClick={this.showDetails}
          >
            <span className="list-item__data">
              <span>{name}</span>
              <span className="list-item__author">{`Added by: ${authorName}`}</span>
            </span>
            {!archived && (
              <VotingBox
                voteForItem={voteForItem}
                votesCount={votesCount}
                isVoted={isVoted}
              />
            )}
          </label>
          <button
            className="list-item__icon z-index-high"
            onClick={this.handleItemToggling(authorName, id, archived)}
            type="button"
          />
        </div>
        {areDetailsVisible && (
          <div className="list-item__details">{this.renderDetails()}</div>
        )}
      </li>
    );
  }
}

ListItem.propTypes = {
  archived: PropTypes.bool,
  authorName: PropTypes.string,
  id: PropTypes.string.isRequired,
  isVoted: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  votesCount: PropTypes.number.isRequired,

  toggleItem: PropTypes.func,
  voteForItem: PropTypes.func
};

export default ListItem;
