import React, { Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import VotingBox from 'modules/list/components/VotingBox';
import Textarea from 'common/components/Forms/Textarea';
import TextInput from 'common/components/Forms/TextInput';
import NewComment from '../../../common/components/Comments/NewComment';
import Comment from '../../../common/components/Comments/Comment';

class ListItem extends PureComponent {
  constructor(props) {
    super(props);
    const { archived } = this.props;
    this.state = {
      areDetailsVisible: false,
      done: archived,

      isNewCommentVisible: false
    };
  }

  handleItemToggling = (authorId, id, archived) => event => {
    const { toggleItem } = this.props;
    event.stopPropagation();

    this.setState(({ done }) => ({ done: !done }));
    toggleItem(authorId, id, archived);
  };

  toggleDetails = () =>
    this.setState(({ areDetailsVisible }) => ({
      areDetailsVisible: !areDetailsVisible
    }));

  showAddNewComment = () => this.setState({ isNewCommentVisible: true });

  hideAddNewComment = () => this.setState({ isNewCommentVisible: false });

  handleAddNewComment = comment => {
    // Adding new comment will be handled in next tasks
  };

  renderDetails = () => {
    const { isNewCommentVisible } = this.state;
    return (
      <Fragment>
        <div className="list-item__info">
          <div className="list-item__info-textarea">
            <Textarea placeholder="Description" />
          </div>
          <div className="list-item__info-details">
            <TextInput placeholder="Link" />
          </div>
        </div>
        <div className="list-item__new-comment">
          {isNewCommentVisible ? (
            <NewComment
              onAddNewComment={this.handleAddNewComment}
              onEscapePress={this.hideAddNewComment}
            />
          ) : (
            <button
              className="list-item__add-new-button link-button"
              onClick={this.showAddNewComment}
              type="button"
            >
              Add comment
            </button>
          )}
        </div>
        <div className="list-item__comments">{this.renderComments()}</div>
      </Fragment>
    );
  };

  renderComments = () => (
    <Fragment>
      <h2 className="list-item__heading">Comments</h2>
      <Comment
        author="Adam Klepacz"
        comment="  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Excepturi voluptatem vitae qui nihil reprehenderit quia nam
                accusantium nobis. Culpa ducimus aspernatur ea libero! Nobis
                ipsam, molestiae similique optio sint hic!"
      />
      <Comment
        author="Adam Klepacz"
        comment="  Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Excepturi voluptatem vitae qui nihil reprehenderit quia nam
                accusantium nobis. Culpa ducimus aspernatur ea libero! Nobis
                ipsam, molestiae similique optio sint hic!"
      />
    </Fragment>
  );

  render() {
    const {
      archived,
      authorId,
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
          'list-item--done': done || archived,
          'list-item--details-visible': areDetailsVisible
        })}
        onClick={this.toggleDetails}
      >
        <div
          className={classNames('list-item__top', {
            'list-item__top--details-visible': areDetailsVisible,
            'list-item__top--details-not-visible': !areDetailsVisible
          })}
        >
          <input
            className="list-item__input"
            id={`option${id}`}
            name={`option${id}`}
            type="checkbox"
          />
          <label className="list-item__label" id={`option${id}`}>
            <span className="list-item__data">
              <span>{name}</span>
              <span className="list-item__author">{`Added by: ${authorName}`}</span>
            </span>
          </label>
          {!archived && (
            <VotingBox
              isVoted={isVoted}
              voteForItem={voteForItem}
              votesCount={votesCount}
            />
          )}
          <button
            className="list-item__icon z-index-high"
            onClick={this.handleItemToggling(authorId, id, archived)}
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
  authorId: PropTypes.string.isRequired,
  authorName: PropTypes.string,
  id: PropTypes.string.isRequired,
  isVoted: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  votesCount: PropTypes.number.isRequired,

  toggleItem: PropTypes.func,
  voteForItem: PropTypes.func
};

export default ListItem;
