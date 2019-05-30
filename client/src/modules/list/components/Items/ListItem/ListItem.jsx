import React, { Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import _isEqual from 'lodash/isEqual';
import isURL from 'validator/lib/isURL';

import VotingBox from 'modules/list/components/Items/VotingBox';
import Textarea from 'common/components/Forms/Textarea';
import TextInput from 'common/components/Forms/TextInput';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import {
  archiveItem,
  clearVote,
  cloneItem,
  setVote,
  toggle,
  updateListItem
} from '../model/actions';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import { PreloaderTheme } from 'common/components/Preloader';
import PendingButton from 'common/components/PendingButton';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import CommentsList from 'common/components/Comments/CommentsList';
import Confirmation from 'common/components/Confirmation';
import ListItemName from '../ListItemName';

class ListItem extends PureComponent {
  constructor(props) {
    super(props);

    const {
      data: { isOrdered, description, link }
    } = this.props;

    this.state = {
      areDetailsVisible: false,
      areFieldsUpdated: false,
      done: isOrdered,
      isNameEdited: false,
      isConfirmationVisible: false,
      isValidationErrorVisible: false,
      itemDescription: description,
      link
    };
  }

  componentDidUpdate() {
    this.checkIfFieldsUpdated();
  }

  handleItemToggling = () => {
    const {
      currentUser: { name, id: userId },
      data: { isOrdered, authorId, _id, name: itemName },
      isMember,
      match: {
        params: { id: listId }
      },
      toggle
    } = this.props;
    const isNotSameAuthor = authorId !== userId;

    if (!isMember) {
      return;
    }

    this.setState(({ done }) => ({ done: !done }));

    const shouldChangeAuthor = isNotSameAuthor && isOrdered;

    return shouldChangeAuthor
      ? toggle(itemName, isOrdered, _id, listId, userId, name)
      : toggle(itemName, isOrdered, _id, listId);
  };

  handleDetailsVisibility = () =>
    this.setState(({ areDetailsVisible }) => ({
      areDetailsVisible: !areDetailsVisible
    }));

  handleDataUpdate = () => {
    const { itemDescription: description, link } = this.state;
    const {
      data: {
        _id: itemId,
        description: previousDescription,
        link: previousLink,
        name: itemName
      },
      isMember,
      match: {
        params: { id: listId }
      },
      updateListItem
    } = this.props;

    if (!isMember) {
      return;
    }

    const isLinkUpdated = !_isEqual(_trim(previousLink), _trim(link));
    const isDescriptionUpdated = !_isEqual(
      _trim(previousDescription),
      _trim(description)
    );

    const canBeUpdated = isURL(link) || _isEmpty(_trim(link));

    if (!canBeUpdated) {
      return this.setState({ isValidationErrorVisible: true });
    }

    if (isLinkUpdated || isDescriptionUpdated) {
      return updateListItem(itemName, listId, itemId, { description, link });
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
      data: { _id: itemId, name },
      isMember,
      match: {
        params: { id: listId }
      }
    } = this.props;

    if (isMember) {
      return cloneItem(name, listId, itemId);
    }
  };

  handleVoting = () => {
    const {
      clearVote,
      data: { _id, isVoted, name },
      setVote,
      match: {
        params: { id: listId }
      }
    } = this.props;

    const action = isVoted ? clearVote : setVote;

    return action(_id, listId, name);
  };

  handleItemLink = value =>
    this.setState({ link: value, isValidationErrorVisible: false });

  handleItemDescription = value => this.setState({ itemDescription: value });

  handleConfirmationVisibility = () =>
    this.setState(({ isConfirmationVisible }) => ({
      isConfirmationVisible: !isConfirmationVisible
    }));

  handleArchiveItem = () => {
    const {
      archiveItem,
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return archiveItem(listId, itemId, name);
  };

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

  preventDefault = event => event.preventDefault();

  handleNameFocus = () => this.setState({ isNameEdited: true });

  handleNameBlur = () => this.setState({ isNameEdited: false });

  renderConfirmation = () => {
    const {
      data: { name },
      isMember
    } = this.props;

    return (
      <div className="list-item__confirmation">
        <h4>{`Do you really want to archive "${name}" item?`}</h4>
        <PendingButton
          className="primary-button"
          disabled={!isMember}
          onClick={this.handleArchiveItem}
          type="button"
          preloaderTheme={PreloaderTheme.LIGHT}
        >
          Confirm
        </PendingButton>
        <button
          className="primary-button"
          disabled={!isMember}
          onClick={this.handleConfirmationVisibility}
          type="button"
        >
          Cancel
        </button>
      </div>
    );
  };

  renderItemFeatures = () => {
    const { isConfirmationVisible } = this.state;
    const {
      data: { isOrdered, name },
      isMember
    } = this.props;

    return (
      <div className="list-item__features">
        <div className="list-item__feature-buttons">
          <button
            className="link-button"
            disabled={!isMember || isConfirmationVisible}
            onClick={this.handleConfirmationVisibility}
            type="button"
          >
            Archive Item
          </button>
          {!isOrdered && (
            <PendingButton
              className="link-button"
              disabled={!isMember || isConfirmationVisible}
              onClick={this.handleItemCloning}
            >
              Clone Item
            </PendingButton>
          )}
        </div>
        {isConfirmationVisible && (
          <Confirmation
            disabled={!isMember}
            onCancel={this.handleConfirmationVisibility}
            onConfirm={this.handleArchiveItem}
            title={`Do you really want to archive "${name}" item?`}
          />
        )}
      </div>
    );
  };

  renderDetails = () => {
    const { areFieldsUpdated, isValidationErrorVisible } = this.state;
    const {
      data: { _id: itemId, comments, description, isOrdered, link },
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
          <div className="list-item__info-link">
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
          </div>
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
        {isMember && this.renderItemFeatures()}
        <div className="list-item__comments">
          <CommentsList
            comments={comments}
            isFormAccessible={isMember && !isOrdered}
            itemId={itemId}
          />
        </div>
      </Fragment>
    );
  };

  render() {
    const {
      data: { isOrdered, authorName, _id, name },
      isMember
    } = this.props;
    const { areDetailsVisible, done, isNameEdited } = this.state;

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
          onClick={isNameEdited ? null : this.handleDetailsVisibility}
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
              <ListItemName
                isMember={isMember}
                itemId={_id}
                name={name}
                onBlur={this.handleNameBlur}
                onFocus={this.handleNameFocus}
              />
              <span className="list-item__author">{`Added by: ${authorName}`}</span>
            </span>
          </label>
          <div className="list-item__buttons">
            {this.renderVoting()}
            <div className="list-item__toggle">
              <PendingButton
                className="list-item__icon"
                disabled={!isMember}
                onClick={this.handleItemToggling}
              />
            </div>
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
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object
    ])
  ),
  isMember: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  archiveItem: PropTypes.func.isRequired,
  clearVote: PropTypes.func.isRequired,
  cloneItem: PropTypes.func.isRequired,
  setVote: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired,
  updateListItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { archiveItem, clearVote, cloneItem, setVote, toggle, updateListItem }
  )(ListItem)
);
