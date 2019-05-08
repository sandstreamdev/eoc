import React, { Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import _isEqual from 'lodash/isEqual';

import VotingBox from 'modules/list/components/Items/VotingBox';
import Textarea from 'common/components/Forms/Textarea';
import TextInput from 'common/components/Forms/TextInput';
import NewComment from 'common/components/Comments/NewComment';
import Comment from 'common/components/Comments/Comment';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import {
  clearVote,
  cloneItem,
  setVote,
  toggle,
  updateItemDetails
} from '../model/actions';
import { isUrlValid } from 'common/utils/helpers';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import { PreloaderTheme } from 'common/components/Preloader';
import PendingButton from 'common/components/PendingButton';
import { getCurrentUser } from 'modules/authorization/model/selectors';

class ListItem extends PureComponent {
  pendingPromises = [];

  constructor(props) {
    super(props);

    const {
      data: { isOrdered, description, link }
    } = this.props;

    this.state = {
      areDetailsVisible: false,
      areFieldsUpdated: false,
      done: isOrdered,
      isNewCommentVisible: false,
      isValidationErrorVisible: false,
      itemDescription: description,
      link
    };
  }

  componentDidUpdate() {
    this.checkIfFieldsUpdated();
  }

  componentWillUnmount() {
    this.pendingPromises.map(promise => promise.abort());
  }

  addPendingPromise = promise => this.pendingPromises.push(promise);

  removePendingPromise = promise => {
    this.pendingPromises = this.pendingPromises.filter(p => p !== promise);
  };

  handleItemToggling = () => {
    const {
      currentUser: { name, id: userId },
      data: { isOrdered, authorId, _id },
      isMember,
      match: {
        params: { id: listId }
      },
      toggle
    } = this.props;
    const isSameAuthor = authorId === userId;

    if (!isMember) {
      return;
    }

    this.setState(({ done }) => ({ done: !done }));

    return isSameAuthor
      ? toggle(isOrdered, _id, listId, name)
      : toggle(isOrdered, _id, listId);
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

  handleDataUpdate = () => {
    const { itemDescription: description, link } = this.state;
    const {
      data: {
        _id: itemId,
        description: previousDescription,
        link: previousLink
      },
      isMember,
      match: {
        params: { id: listId }
      },
      updateItemDetails
    } = this.props;

    if (!isMember) {
      return;
    }

    const isLinkUpdated = !_isEqual(_trim(previousLink), _trim(link));
    const canBeUpdated = isUrlValid(link) || _isEmpty(_trim(link));
    const isDescriptionUpdated = !_isEqual(
      _trim(previousDescription),
      _trim(description)
    );

    if (!canBeUpdated) {
      return this.setState({ isValidationErrorVisible: true });
    }

    if (isLinkUpdated || isDescriptionUpdated) {
      return updateItemDetails(listId, itemId, { description, link });
    }
  };

  checkIfFieldsUpdated = () => {
    const {
      data: { description: previousDescription, link: previousLink }
    } = this.props;
    const { itemDescription, link } = this.state;

    const isLinkUpdated = !_isEqual(_trim(previousLink), _trim(link));
    const isDescriptionUpdated = !_isEqual(
      _trim(previousDescription),
      _trim(itemDescription)
    );

    this.setState({ areFieldsUpdated: isLinkUpdated || isDescriptionUpdated });
  };

  handleItemCloning = () => {
    const {
      cloneItem,
      data: { _id: itemId },
      isMember,
      match: {
        params: { id: listId }
      }
    } = this.props;

    if (isMember) {
      return cloneItem(listId, itemId);
    }
  };

  handleVoting = () => {
    const {
      clearVote,
      data: { _id, isVoted },
      setVote,
      match: {
        params: { id: listId }
      }
    } = this.props;

    const action = isVoted ? clearVote : setVote;

    return action(_id, listId);
  };

  handleItemLink = value =>
    this.setState({ link: value, isValidationErrorVisible: false });

  handleItemDescription = value => this.setState({ itemDescription: value });

  renderVoting = () => {
    const {
      data: { isOrdered, isVoted, votesCount },
      isMember
    } = this.props;

    if (isOrdered) {
      return null;
    }

    return (
      <div className="list-item__voting">
        <VotingBox
          isMember={isMember}
          isVoted={isVoted}
          onVote={this.handleVoting}
          votesCount={votesCount}
        />
      </div>
    );
  };

  renderDetails = () => {
    const { areFieldsUpdated, isValidationErrorVisible } = this.state;
    const {
      data: { description, isOrdered, link },
      isMember
    } = this.props;
    const isFieldDisabled = !isMember;

    return (
      <Fragment>
        <div className="list-item__info">
          <div className="list-item__info-textarea">
            <Textarea
              disabled={isFieldDisabled}
              initialValue={description}
              onChange={isMember ? this.handleItemDescription : null}
              placeholder="Description"
            />
          </div>
          <div className="list-item__info-details">
            <TextInput
              disabled={isFieldDisabled}
              initialValue={link}
              onChange={isMember ? this.handleItemLink : null}
              placeholder="Link"
            />
            {isValidationErrorVisible && (
              <div className="list-item__validation-error">
                <ErrorMessage message="Incorrect url." />
              </div>
            )}
            {areFieldsUpdated && isMember && (
              <div className="list-item__save-details">
                <PendingButton
                  className="primary-button"
                  disabled={isValidationErrorVisible || !isMember}
                  onClick={this.handleDataUpdate}
                  preloaderTheme={PreloaderTheme.LIGHT}
                >
                  Save
                </PendingButton>
              </div>
            )}
          </div>
        </div>
        {!isOrdered && isMember && (
          <div className="list-item__cloning">
            <PendingButton
              className="link-button"
              disabled={!isMember}
              onClick={this.handleItemCloning}
            >
              Clone Item
            </PendingButton>
          </div>
        )}
      </Fragment>
    );
  };

  renderCommentForm = () => {
    const { isNewCommentVisible } = this.state;

    return (
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
    );
  };

  renderComments = () => (
    <Fragment>
      {this.renderCommentForm()}
      <div className="list-item__comments">
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
      </div>
    </Fragment>
  );

  render() {
    const {
      data: { isOrdered, authorName, _id, name },
      isMember
    } = this.props;
    const { done, areDetailsVisible } = this.state;

    return (
      <li
        className={classNames('list-item', {
          'list-item--restore': !done && isOrdered,
          'list-item--done': done || isOrdered,
          'list-item--details-visible': areDetailsVisible
        })}
      >
        <div
          className={classNames('list-item__top', {
            'list-item__top--details-visible': areDetailsVisible,
            'list-item__top--details-not-visible': !areDetailsVisible
          })}
          onClick={this.toggleDetails}
          role="listitem"
        >
          <input
            className="list-item__input"
            id={`option${_id}`}
            name={`option${_id}`}
            type="checkbox"
          />
          <label className="list-item__label" id={`option${_id}`}>
            <span className="list-item__data">
              <span>{name}</span>
              <span className="list-item__author">{`Added by: ${authorName}`}</span>
            </span>
          </label>
          {this.renderVoting()}
          <div className="list-item__toggle z-index-high">
            <PendingButton
              className="list-item__icon"
              disabled={!isMember}
              onClick={this.handleItemToggling}
            />
          </div>
        </div>
        {areDetailsVisible && (
          <div className="list-item__details">{this.renderDetails()}</div>
        )}
      </li>
    );
  }
}

ListItem.propTypes = {
  currentUser: UserPropType.isRequired,
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number])
  ),
  isMember: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  clearVote: PropTypes.func.isRequired,
  cloneItem: PropTypes.func.isRequired,
  setVote: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  updateItemDetails: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { clearVote, cloneItem, setVote, toggle, updateItemDetails }
  )(ListItem)
);
