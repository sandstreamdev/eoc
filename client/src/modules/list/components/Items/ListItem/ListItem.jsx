import React, { Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import VotingBox from 'modules/list/components/Items/VotingBox';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import {
  archiveItem,
  clearVote,
  cloneItem,
  lockItem,
  setVote,
  unlockItem,
  updateListItem
} from '../model/actions';
import { PreloaderTheme } from 'common/components/Preloader';
import PendingButton from 'common/components/PendingButton';
import { getCurrentUser } from 'modules/user/model/selectors';
import CommentsList from 'common/components/Comments/CommentsList';
import Confirmation from 'common/components/Confirmation';
import ListItemName from '../ListItemName';
import ListItemDescription from '../ListItemDescription';
import { DefaultLocks } from 'common/constants/enums';

class ListItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      areDetailsVisible: false,
      isConfirmationVisible: false,
      isNameEdited: false
    };
  }

  componentWillUnmount() {
    this.handleItemUnlock();
  }

  markAsDone = () => {
    const isOrdered = true;

    this.setState({
      disableToggleButton: true
    });
    this.updateItem(isOrdered);
  };

  markAsUnhandled = () => {
    const isOrdered = false;

    this.setState({
      disableToggleButton: true
    });
    this.updateItem(isOrdered);
  };

  updateItem = isOrdered => {
    const {
      currentUser: { name: userName, id: userId },
      data: { _id, name: itemName },
      isMember,
      match: {
        params: { id: listId }
      },
      updateListItem
    } = this.props;
    const userData = { userId, editedBy: userName };
    const data = { isOrdered, _id };

    if (!isMember) {
      return;
    }

    this.handleItemLock();

    return updateListItem(itemName, listId, _id, userData, data).finally(() =>
      this.setState({ disableToggleButton: false }, this.handleItemUnlock)
    );
  };

  handleDetailsVisibility = event => {
    event.preventDefault();

    this.setState(({ areDetailsVisible }) => ({
      areDetailsVisible: !areDetailsVisible
    }));
  };

  handleItemCloning = event => {
    event.preventDefault();

    const {
      cloneItem,
      data: { _id: itemId, name },
      isMember,
      match: {
        params: { id: listId }
      }
    } = this.props;

    this.handleItemLock();

    if (isMember) {
      return cloneItem(name, listId, itemId).finally(this.handleItemUnlock);
    }
  };

  handleVoting = event => {
    event.preventDefault();

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

  handleConfirmationVisibility = event => {
    event.preventDefault();

    this.setState(({ isConfirmationVisible }) => ({
      isConfirmationVisible: !isConfirmationVisible
    }));
  };

  handleArchiveItem = event => {
    event.preventDefault();

    const {
      archiveItem,
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      }
    } = this.props;

    this.handleItemLock();

    return archiveItem(listId, itemId, name).finally(this.handleItemUnlock);
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

  handleItemLock = () => {
    const {
      currentUser: { id: userId },
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return lockItem(itemId, listId, userId, {
      descriptionLock: true,
      nameLock: true
    });
  };

  handleItemUnlock = () => {
    const {
      currentUser: { id: userId },
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    unlockItem(itemId, listId, userId, {
      descriptionLock: false,
      nameLock: false
    });
  };

  handleNameLock = () => {
    const {
      currentUser: { id: userId },
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    lockItem(itemId, listId, userId, { nameLock: true });
  };

  handleNameUnlock = () => {
    const {
      currentUser: { id: userId },
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    unlockItem(itemId, listId, userId, { nameLock: false });
  };

  handleDescriptionLock = () => {
    const {
      currentUser: { id: userId },
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    lockItem(itemId, listId, userId, { descriptionLock: true });
  };

  handleDescriptionUnlock = () => {
    const {
      currentUser: { id: userId },
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    unlockItem(itemId, listId, userId, { descriptionLock: false });
  };

  renderConfirmation = () => {
    const {
      data: { name },
      isMember
    } = this.props;

    return (
      <div className="list-item__confirmation">
        <h4>
          <FormattedMessage id="list.list-item.header" values={{ name }} />
        </h4>
        <PendingButton
          className="primary-button"
          disabled={!isMember}
          onClick={this.handleArchiveItem}
          preloaderTheme={PreloaderTheme.LIGHT}
          type="button"
        >
          <FormattedMessage id="common.button.confirm" />
        </PendingButton>
        <button
          className="primary-button"
          disabled={!isMember}
          onClick={this.handleConfirmationVisibility}
          type="button"
        >
          <FormattedMessage id="common.button.cancel" />
        </button>
      </div>
    );
  };

  renderItemFeatures = () => {
    const { isConfirmationVisible } = this.state;
    const {
      data: {
        isOrdered,
        locks: { name: nameLock, description: descriptionLock } = DefaultLocks,
        name
      },
      isMember
    } = this.props;
    const isEdited = nameLock || descriptionLock;

    return (
      <div className="list-item__features">
        <div className="list-item__feature-buttons">
          <button
            className="link-button"
            disabled={!isMember || isConfirmationVisible || isEdited}
            onClick={this.handleConfirmationVisibility}
            type="button"
          >
            <FormattedMessage id="list.list-item.archive" />
          </button>
          {!isOrdered && (
            <PendingButton
              className="link-button"
              disabled={!isMember || isConfirmationVisible || isEdited}
              onClick={this.handleItemCloning}
            >
              <FormattedMessage id="list.list-item.clone" />
            </PendingButton>
          )}
        </div>
        {isConfirmationVisible && (
          <Confirmation
            disabled={!isMember}
            onCancel={this.handleConfirmationVisibility}
            onConfirm={this.handleArchiveItem}
          >
            <FormattedMessage
              id="list.list-item.confirmation"
              values={{ name: <em>{name}</em> }}
            />
          </Confirmation>
        )}
      </div>
    );
  };

  renderDescription = () => {
    const {
      data: {
        _id: itemId,
        description,
        isOrdered,
        locks: { description: descriptionLock } = DefaultLocks,
        name
      },
      isMember
    } = this.props;
    const isFieldDisabled = !isMember || isOrdered;

    if (description || !isFieldDisabled) {
      return (
        <div className="list-item__description">
          <ListItemDescription
            description={description}
            disabled={isFieldDisabled}
            itemId={itemId}
            locked={descriptionLock}
            name={name}
            onBlur={this.handleDescriptionUnlock}
            onFocus={this.handleDescriptionLock}
          />
        </div>
      );
    }
  };

  renderDetails = () => {
    const {
      data: { _id: itemId, comments, isOrdered, name },
      isMember
    } = this.props;

    return (
      <Fragment>
        {this.renderDescription()}
        {isMember && this.renderItemFeatures()}
        <div className="list-item__comments">
          <CommentsList
            comments={comments}
            isFormAccessible={isMember && !isOrdered}
            itemId={itemId}
            itemName={name}
          />
        </div>
      </Fragment>
    );
  };

  render() {
    const {
      data: {
        _id,
        authorName,
        editedBy,
        isOrdered,
        locks: { name: nameLock, description: descriptionLock } = DefaultLocks,
        name
      },
      isMember
    } = this.props;
    const { areDetailsVisible, disableToggleButton, isNameEdited } = this.state;
    const isEdited = nameLock || descriptionLock;

    return (
      <li
        className={classNames('list-item', {
          'list-item--done': isOrdered,
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
                locked={nameLock}
                name={name}
                onBlur={this.handleNameUnlock}
                onFocus={this.handleNameLock}
                onPending={this.handleNameLock}
              />
              <span className="list-item__author">
                <FormattedMessage
                  id="list.list-item.author"
                  values={{ authorName }}
                />
              </span>
              {editedBy && (
                <span className="list-item__edited-by">
                  <FormattedMessage
                    id="list.list-item.edited-by"
                    values={{ editedBy }}
                  />
                </span>
              )}
            </span>
          </label>
          <div className="list-item__buttons">
            {this.renderVoting()}
            <div className="list-item__toggle">
              <PendingButton
                className="list-item__icon"
                disabled={disableToggleButton || !isMember || isEdited}
                onClick={isOrdered ? this.markAsUnhandled : this.markAsDone}
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
  updateListItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  withRouter,
  connect(
    mapStateToProps,
    {
      archiveItem,
      clearVote,
      cloneItem,
      setVote,
      updateListItem
    }
  )
)(ListItem);
