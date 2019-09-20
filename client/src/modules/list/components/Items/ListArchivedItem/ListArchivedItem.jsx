import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import PendingButton from 'common/components/PendingButton';
import {
  IntlPropType,
  RouterMatchPropType,
  UserPropType
} from 'common/constants/propTypes';
import {
  deleteItem,
  restoreItem
} from 'modules/list/components/Items/model/actions';
import Confirmation from 'common/components/Confirmation';
import { getCurrentUser } from 'modules/user/model/selectors';

class ListArchivedItem extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isConfirmationVisible: false
    };
  }

  handleRestoringItem = () => {
    const {
      currentUser: { name: userName },
      data: { _id: itemId, done, name },
      match: {
        params: { id: listId }
      },
      restoreItem
    } = this.props;

    return restoreItem(listId, itemId, name, userName, done);
  };

  showConfirmation = () => this.setState({ isConfirmationVisible: true });

  hideConfirmation = () => this.setState({ isConfirmationVisible: false });

  handleDeletingItem = () => {
    const {
      deleteItem,
      data: { _id: itemId, name },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return deleteItem(listId, itemId, name);
  };

  render() {
    const {
      data: { authorName, name, done, votesCount },
      intl: { formatMessage },
      isMember
    } = this.props;
    const { isConfirmationVisible } = this.state;

    return (
      <li className="list-archived-item">
        <div className="list-archived-item__wrapper">
          <div className="list-archived-item__data">
            <span className="list-archived-item__name">{name}</span>
            <span className="list-archived-item__author">
              <FormattedMessage
                id="list.list-archived-item.author"
                values={{ authorName }}
              />
            </span>
            <div className="list-archived-item__details">
              <FormattedMessage id="list.list-archived-item.archived" />
              <span>
                {formatMessage(
                  {
                    id: 'list.list-archived-item.votes-count'
                  },
                  { votesCount }
                )}
              </span>
              <FormattedMessage
                id={
                  done
                    ? 'list.list-archived-item.done'
                    : 'list.list-archived-item.unhandled'
                }
              />
            </div>
          </div>
          <div className="list-archived-item__features">
            <PendingButton
              className="link-button"
              onClick={this.handleRestoringItem}
              type="button"
            >
              <FormattedMessage id="list.list-archived-item.restore" />
            </PendingButton>
            <button
              className="link-button"
              onClick={this.showConfirmation}
              type="button"
            >
              <FormattedMessage id="list.list-archived-item.delete" />
            </button>
          </div>
        </div>
        {isConfirmationVisible && (
          <Confirmation
            disabled={!isMember}
            onCancel={this.hideConfirmation}
            onConfirm={this.handleDeletingItem}
          >
            <FormattedMessage
              id="list.list-archived-item.confirmation"
              values={{ name: <em>{name}</em> }}
            />
          </Confirmation>
        )}
      </li>
    );
  }
}

ListArchivedItem.propTypes = {
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

  deleteItem: PropTypes.func.isRequired,
  restoreItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    { deleteItem, restoreItem }
  )
)(ListArchivedItem);
