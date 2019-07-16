import React, { Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import VotingBox from 'modules/list/components/Items/VotingBox';
import {
  RouterMatchPropType,
  UserPropType,
  IntlPropType
} from 'common/constants/propTypes';
import {
  archiveItem,
  clearVote,
  cloneItem,
  lockItem,
  setVote,
  toggle,
  unlockItem
} from '../model/actions';
import { PreloaderTheme } from 'common/components/Preloader';
import PendingButton from 'common/components/PendingButton';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import CommentsList from 'common/components/Comments/CommentsList';
import Confirmation from 'common/components/Confirmation';
import ListItemName from '../ListItemName';
import ListItemDescription from '../ListItemDescription';

class ListItem extends PureComponent {
  constructor(props) {
    super(props);

    const {
      data: { isOrdered }
    } = this.props;

    this.state = {
      areDetailsVisible: false,
      descriptionLock: false,
      done: isOrdered,
      isConfirmationVisible: false,
      isNameEdited: false,
      nameLock: false
    };
  }

  handleItemToggling = event => {
    event.preventDefault();

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

    this.setState(({ done }) => ({
      done: !done,
      disableToggleButton: true
    }));

    this.lockItem();

    const shouldChangeAuthor = isNotSameAuthor && isOrdered;

    if (shouldChangeAuthor) {
      return toggle(itemName, isOrdered, _id, listId, userId, name).finally(
        () => this.unlockItem()
      );
    }

    toggle(itemName, isOrdered, _id, listId);
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

    this.lockItem();

    if (isMember) {
      return cloneItem(name, listId, itemId).finally(() => this.unlockItem());
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

    this.lockItem();

    return action(_id, listId, name).finally(() => this.unlockItem());
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

    this.lockItem();

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

  handleNameLock = () => {
    this.setState({ nameLock: true, descriptionLock: false }, this.lockItem);
  };

  handleNameUnlock = () => {
    this.setState({ nameLock: false, descriptionLock: false }, this.unlockItem);
  };

  handleDescriptionLock = () => {
    this.setState({ nameLock: false, descriptionLock: true }, this.lockItem);
  };

  handleDescriptionUnlock = () => {
    this.setState({ nameLock: false, descriptionLock: false }, this.unlockItem);
  };

  lockItem = () => {
    const { nameLock, descriptionLock } = this.state;
    const {
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    lockItem(itemId, listId, { nameLock, descriptionLock });
  };

  unlockItem = () => {
    const { nameLock, descriptionLock } = this.state;
    const {
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    unlockItem(itemId, listId, { nameLock, descriptionLock });
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
          onTouchEnd={this.handleArchiveItem}
          preloaderTheme={PreloaderTheme.LIGHT}
          type="button"
        >
          <FormattedMessage id="common.button.confirm" />
        </PendingButton>
        <button
          className="primary-button"
          disabled={!isMember}
          onClick={this.handleConfirmationVisibility}
          onTouchEnd={this.handleConfirmationVisibility}
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
      data: { isOrdered, name, nameLock = false, descriptionLock = false },
      intl: { formatMessage },
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
            onTouchEnd={this.handleConfirmationVisibility}
            type="button"
          >
            <FormattedMessage id="list.list-item.archive" />
          </button>
          {!isOrdered && (
            <PendingButton
              className="link-button"
              disabled={!isMember || isConfirmationVisible}
              onClick={this.handleItemCloning}
              onTouchEnd={this.handleItemCloning}
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
            title={formatMessage(
              {
                id: 'list.list-item.confirmation'
              },
              { name }
            )}
          />
        )}
      </div>
    );
  };

  renderDescription = () => {
    const {
      data: {
        _id: itemId,
        description,
        descriptionLock = false,
        isOrdered,
        name
      },
      isMember
    } = this.props;
    const isFieldDisabled = !isMember || isOrdered;

    if (description || !isFieldDisabled) {
      return (
        <div className="list-item__description">
          <ListItemDescription
            locked={descriptionLock}
            description={description}
            disabled={isFieldDisabled}
            itemId={itemId}
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
        descriptionLock = false,
        isOrdered,
        name,
        nameLock = false
      },
      isMember
    } = this.props;
    const {
      areDetailsVisible,
      disableToggleButton,
      done,
      isNameEdited
    } = this.state;
    const isEdited = nameLock || descriptionLock;

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
                locked={nameLock}
                isMember={isMember}
                itemId={_id}
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
            </span>
          </label>
          <div className="list-item__buttons">
            {this.renderVoting()}
            <div className="list-item__toggle">
              <PendingButton
                className="list-item__icon"
                disabled={disableToggleButton || !isMember || isEdited}
                onClick={this.handleItemToggling}
                onTouchEnd={this.handleItemToggling}
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
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  archiveItem: PropTypes.func.isRequired,
  clearVote: PropTypes.func.isRequired,
  cloneItem: PropTypes.func.isRequired,
  setVote: PropTypes.func.isRequired,
  toggle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    {
      archiveItem,
      clearVote,
      cloneItem,
      setVote,
      toggle
    }
  )
)(ListItem);
