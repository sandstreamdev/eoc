import React, { Fragment, PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { pipe } from '@sandstreamdev/std/function';

import VotingBox from 'modules/list/components/Items/VotingBox';
import {
  IntlPropType,
  RouterMatchPropType,
  UserPropType
} from 'common/constants/propTypes';
import {
  archiveItem,
  clearVote,
  cloneItem,
  lockItem,
  markAsDone,
  markAsUnhandled,
  setVote,
  unlockItem
} from '../model/actions';
import PendingButton from 'common/components/PendingButton';
import { getCurrentUser } from 'modules/user/model/selectors';
import CommentsList from 'common/components/Comments/CommentsList';
import Confirmation from 'common/components/Confirmation';
import ListItemName from '../ListItemName';
import ListItemDescription from '../ListItemDescription';
import { DefaultLocks } from 'common/constants/enums';
import MoveToListPanel from '../MoveToListPanel';
import './ListItem.scss';
import { formatName } from 'common/utils/helpers';

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

  componentWillUnmount() {
    this.handleItemUnlock();
  }

  handleItemStatus = () => {
    const {
      currentUser: { name: editedBy },
      data: { _id: itemId, name: itemName, done },
      isMember,
      markAsDone,
      markAsUnhandled,
      match: {
        params: { id: listId }
      }
    } = this.props;

    if (!isMember) {
      return;
    }

    const action = done ? markAsUnhandled : markAsDone;

    return action(listId, itemId, itemName, editedBy).finally(
      this.handleItemUnlock
    );
  };

  handleDetailsVisibility = () =>
    this.setState(
      ({ areDetailsVisible }) => ({
        areDetailsVisible: !areDetailsVisible
      }),
      this.handleResetDetails
    );

  handleResetDetails = () => {
    const { areDetailsVisible } = this.state;

    if (!areDetailsVisible) {
      this.setState({
        isConfirmationVisible: false,
        isMoveToListPanelVisible: false
      });
    }
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

  handleArchiveItem = () => {
    const {
      archiveItem,
      currentUser: { name: editedBy },
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      }
    } = this.props;

    this.handleItemLock();

    return archiveItem(listId, itemId, name, editedBy).finally(
      this.handleItemUnlock
    );
  };

  renderVoting = () => {
    const {
      data: { done, isVoted, votesCount },
      isMember
    } = this.props;

    if (done) {
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
        done,
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
          type="button"
        >
          <FormattedMessage id="list.list-item.archive" />
        </button>
        {!done && (
          <Fragment>
            <PendingButton
              className="link-button"
              disabled={disabled}
              onClick={this.handleItemCloning}
            >
              <FormattedMessage id="list.list-item.clone" />
            </PendingButton>
            <button
              className="link-button"
              disabled={disabled}
              onClick={this.showMoveToPanel}
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
        done,
        locks: { description: descriptionLock } = DefaultLocks,
        name
      },
      isMember
    } = this.props;
    const isFieldDisabled = !isMember || done;

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
      data: { _id: itemId, comments, done, name },
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
            isFormAccessible={isMember && !done}
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
        done,
        locks: { name: nameLock, description: descriptionLock } = DefaultLocks,
        name
      },
      intl: { formatMessage },
      isMember
    } = this.props;
    const { areDetailsVisible, isNameEdited } = this.state;
    const isEdited = nameLock || descriptionLock;
    const formattedName = formatName(authorName, formatMessage);
    const formatEditedBy = formatName(editedBy, formatMessage);

    return (
      <li
        className={classNames('list-item', {
          'list-item--done': done,
          'list-item--details-visible': areDetailsVisible
        })}
      >
        <div
          className={classNames('list-item__wrapper', {
            'list-item__wrapper--details-visible': areDetailsVisible,
            'list-item__wrapper--details-not-visible': !areDetailsVisible
          })}
          onClick={isNameEdited ? null : this.handleDetailsVisibility}
          role="listitem"
        >
          <div className="list-item__top">
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
              </span>
            </label>
          </div>
          <div className="list-item__bottom">
            <div className="list-item__performers">
              <span className="list-item__author">
                <FormattedMessage
                  id="list.list-item.author"
                  values={{ authorName: formattedName }}
                />
              </span>
              {editedBy && (
                <span className="list-item__edited-by">
                  <FormattedMessage
                    id="list.list-item.edited-by"
                    values={{ editedBy: formatEditedBy }}
                  />
                </span>
              )}
            </div>
            <div className="list-item__buttons">
              {this.renderVoting()}
              <div className="list-item__toggle">
                <PendingButton
                  className="list-item__icon"
                  disabled={!isMember || isEdited}
                  onClick={this.handleItemStatus}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="list-item__details-wrapper">
          {areDetailsVisible && (
            <div className="list-item__details">{this.renderDetails()}</div>
          )}
        </div>
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
  markAsDone: PropTypes.func.isRequired,
  markAsUnhandled: PropTypes.func.isRequired,
  setVote: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default pipe(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    {
      archiveItem,
      clearVote,
      cloneItem,
      markAsDone,
      markAsUnhandled,
      setVote
    }
  )
)(ListItem);
