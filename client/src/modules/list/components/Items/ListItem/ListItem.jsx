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
import { RouterMatchPropType } from 'common/constants/propTypes';
import {
  clearVote,
  cloneItem,
  setVote,
  updateItemDetails
} from '../model/actions';
import { isUrlValid, makeAbortablePromise } from 'common/utils/helpers';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';

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
      link,
      pendingForCloning: false,
      pendingForDetails: false,
      pendingForToggling: false,
      pendingForVoting: false
    };
  }

  componentDidUpdate() {
    this.checkIfFieldsUpdated();
  }

  componentWillUnmount() {
    this.pendingPromises.map(promise => promise.abort());
  }

  addPendingPromise = promise => {
    this.pendingPromises.push(promise);
  };

  removePendingPromise = promise => {
    this.pendingPromises = this.pendingPromises.filter(p => p !== promise);
  };

  handleItemToggling = (authorId, id, isOrdered) => event => {
    const { toggleItem } = this.props;
    event.stopPropagation();

    this.setState(({ done }) => ({ done: !done, pendingForToggling: true }));
    // this.setState({ pendingForToggling: true });

    const abortableToggling = makeAbortablePromise(
      toggleItem(authorId, id, isOrdered)
    );
    this.addPendingPromise(abortableToggling);

    return abortableToggling.promise
      .then(() => this.setState({ pendingForToggling: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pendingForToggling: false });
        }
      })
      .finally(() => this.removePendingPromise(abortableToggling));
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
      match: {
        params: { id: listId }
      },
      updateItemDetails
    } = this.props;
    const isLinkUpdated = !_isEqual(_trim(previousLink), _trim(link));
    const isDescriptionUpdated = !_isEqual(
      _trim(previousDescription),
      _trim(description)
    );

    const canBeUpdated = isUrlValid(link) || _isEmpty(_trim(link));

    if (!canBeUpdated) {
      return this.setState({ isValidationErrorVisible: true });
    }

    if (isLinkUpdated || isDescriptionUpdated) {
      this.setState({ pendingForDetails: true });

      const abortableDetails = makeAbortablePromise(
        updateItemDetails(listId, itemId, { description, link })
      );
      this.addPendingPromise(abortableDetails);

      return abortableDetails.promise
        .then(() => this.setState({ pendingForDetails: false }))
        .catch(err => {
          if (!(err instanceof AbortPromiseException)) {
            this.setState({ pendingForDetails: false });
          }
        })
        .finally(() => this.removePendingPromise(abortableDetails));
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

  handleItemCloning = event => {
    event.stopPropagation();
    const {
      cloneItem,
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    this.setState({ pendingForCloning: true });
    const abortableCloning = makeAbortablePromise(cloneItem(listId, itemId));
    this.addPendingPromise(abortableCloning);

    return abortableCloning.promise
      .then(() => this.setState({ pendingForCloning: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pendingForCloning: false });
        }
      })
      .finally(() => this.removePendingPromise(abortableCloning));
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
    this.setState({ pendingForVoting: true });
    const abortableVoting = makeAbortablePromise(action(_id, listId));
    this.addPendingPromise(abortableVoting);

    return abortableVoting.promise
      .then(() => this.setState({ pendingForVoting: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pendingForCloning: false });
        }
      })
      .finally(() => this.removePendingPromise(abortableVoting));
  };

  handleItemLink = value =>
    this.setState({ link: value, isValidationErrorVisible: false });

  handleItemDescription = value => this.setState({ itemDescription: value });

  renderVoting = () => {
    const {
      data: { isOrdered, isVoted, votesCount }
    } = this.props;
    const { pendingForVoting } = this.state;

    if (isOrdered) {
      return null;
    }

    return (
      <div className="list-item__voting">
        <VotingBox
          isVoted={isVoted}
          disabled={pendingForVoting}
          onVoting={this.handleVoting}
          votesCount={votesCount}
        />
        {pendingForVoting && <Preloader size={PreloaderSize.SMALL} />}
      </div>
    );
  };

  renderDetails = () => {
    const {
      areFieldsUpdated,
      isValidationErrorVisible,
      pendingForCloning,
      pendingForDetails
    } = this.state;
    const {
      data: { description, isOrdered, link }
    } = this.props;

    return (
      <Fragment>
        <div className="list-item__info">
          <div className="list-item__info-textarea">
            <Textarea
              initialValue={description}
              onChange={this.handleItemDescription}
              placeholder="Description"
            />
          </div>
          <div className="list-item__info-details">
            <TextInput
              initialValue={link}
              onChange={this.handleItemLink}
              placeholder="Link"
            />
            {isValidationErrorVisible && (
              <div className="list-item__validation-error">
                <ErrorMessage message="Incorrect url." />
              </div>
            )}
            {areFieldsUpdated && (
              <div className="list-item__save-details">
                <button
                  className="primary-button"
                  disabled={pendingForDetails || isValidationErrorVisible}
                  onClick={this.handleDataUpdate}
                  type="button"
                >
                  Save
                </button>
                {pendingForDetails && (
                  <Preloader
                    size={PreloaderSize.SMALL}
                    theme={PreloaderTheme.LIGHT}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        {!isOrdered && (
          <div className="list-item__cloning">
            <button
              className="link-button"
              disabled={pendingForCloning}
              onClick={this.handleItemCloning}
              type="button"
            >
              Clone Item
            </button>
            {pendingForCloning && <Preloader size={PreloaderSize.SMALL} />}
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
      data: { isOrdered, authorId, authorName, _id, name }
    } = this.props;
    const { done, areDetailsVisible, pendingForToggling } = this.state;

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
          <button
            className="list-item__icon z-index-high"
            disabled={pendingForToggling}
            onClick={this.handleItemToggling(authorId, _id, isOrdered)}
            type="button"
          />
          {pendingForToggling && (
            <div className="list-item__icon-preloader z-index-high">
              <Preloader size={PreloaderSize.SMALL} />
            </div>
          )}
        </div>
        {areDetailsVisible && (
          <div className="list-item__details">{this.renderDetails()}</div>
        )}
      </li>
    );
  }
}

ListItem.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.bool, PropTypes.number])
  ),
  match: RouterMatchPropType.isRequired,

  clearVote: PropTypes.func.isRequired,
  cloneItem: PropTypes.func.isRequired,
  setVote: PropTypes.func.isRequired,
  toggleItem: PropTypes.func,
  updateItemDetails: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { clearVote, cloneItem, setVote, updateItemDetails }
  )(ListItem)
);
