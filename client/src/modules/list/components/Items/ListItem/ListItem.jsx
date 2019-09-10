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
import PendingButton from 'common/components/PendingButton';
import { getCurrentUser } from 'modules/user/model/selectors';
import CommentsList from 'common/components/Comments/CommentsList';
import Confirmation from 'common/components/Confirmation';
import ListItemName from '../ListItemName';
import ListItemDescription from '../ListItemDescription';
import { DefaultLocks } from 'common/constants/enums';
import MoveToListPanel from '../MoveToListPanel';

class ListItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      areDetailsVisible: false,
      isConfirmationVisible: false,
      isMoveToListPanelVisible: false,
      isNameEdited: false
    };
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

    this.setState(
      ({ areDetailsVisible }) => ({
        areDetailsVisible: !areDetailsVisible
      }),
      this.handleResetDetails
    );
  };

  handleResetDetails = () => {
    const { areDetailsVisible } = this.state;

    if (!areDetailsVisible) {
      this.setState({
        isConfirmationVisible: false,
        isMoveToListPanelVisible: false
      });
    }
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

  hideConfirmation = () => this.setState({ isConfirmationVisible: false });

  showConfirmation = () => this.setState({ isConfirmationVisible: true });

  hideMoveToPanel = () => this.setState({ isMoveToListPanelVisible: false });

  showMoveToPanel = () => this.setState({ isMoveToListPanelVisible: true });

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

  renderFeatureButtons = () => {
    const { isConfirmationVisible, isMoveToListPanelVisible } = this.state;
    const {
      data: {
        isOrdered,
        locks: { description: descriptionLock, name: nameLock } = DefaultLocks
      },
      isMember
    } = this.props;
    const isEdited = nameLock || descriptionLock;
    const disabled =
      isEdited ||
      isMoveToListPanelVisible ||
      isConfirmationVisible ||
      !isMember;

    return (
      <div className="list-item__feature-buttons">
        <button
          className="link-button"
          disabled={disabled}
          onClick={this.showConfirmation}
          onTouchEnd={this.showConfirmation}
          type="button"
        >
          <FormattedMessage id="list.list-item.archive" />
        </button>
        {!isOrdered && (
          <Fragment>
            <PendingButton
              className="link-button"
              disabled={disabled}
              onClick={this.handleItemCloning}
              onTouchEnd={this.handleItemCloning}
            >
              <FormattedMessage id="list.list-item.clone" />
            </PendingButton>
            <button
              className="link-button"
              disabled={disabled}
              onClick={this.showMoveToPanel}
              onTouchEnd={this.showMoveToPanel}
              type="button"
            >
              <FormattedMessage id="list.list-item.move" />
            </button>
          </Fragment>
        )}
      </div>
    );
  };

  renderConfirmation = () => {
    const {
      data: { name },
      isMember
    } = this.props;

    return (
      <Confirmation
        disabled={!isMember}
        onCancel={this.hideConfirmation}
        onConfirm={this.handleArchiveItem}
      >
        <FormattedMessage
          id="list.list-item.confirmation"
          values={{ name: <em>{name}</em> }}
        />
      </Confirmation>
    );
  };

  renderMoveToPanel = () => {
    const { data } = this.props;

    return (
      <MoveToListPanel
        data={data}
        lockItem={this.handleItemLock}
        onClose={this.hideMoveToPanel}
        unlockItem={this.handleItemUnlock}
      />
    );
  };

  renderItemFeatures = () => {
    const { isConfirmationVisible, isMoveToListPanelVisible } = this.state;

    if (isConfirmationVisible) {
      return this.renderConfirmation();
    }

    if (isMoveToListPanelVisible) {
      return this.renderMoveToPanel();
    }

    return this.renderFeatureButtons();
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
        <div className="list-item__features">
          {isMember && this.renderItemFeatures()}
        </div>
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
          onTouchEnd={isNameEdited ? null : this.handleDetailsVisibility}
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
                onTouchEnd={isOrdered ? this.markAsUnhandled : this.markAsDone}
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
