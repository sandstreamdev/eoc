import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import { injectIntl } from 'react-intl';
import { FormattedMessage } from 'react-intl';

import Filter from './Filter';
import { fetchListsForItem } from 'modules/list/model/actions';
import { getListsForItem } from 'modules/list/model/selectors';
import { IntlPropType, RouterMatchPropType } from 'common/constants/propTypes';
import Preloader from 'common/components/Preloader';
import { CloseIcon } from 'assets/images/icons';
import Confirmation from 'common/components/Confirmation';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';

class MoveToPanel extends PureComponent {
  pendingPromise = null;

  state = {
    isConfirmationVisible: false,
    listsToDisplay: [],
    pending: false,
    listId: null,
    listName: null
  };

  componentDidMount() {
    const { fetchListsForItem, lists } = this.props;

    this.setState({ pending: true });

    this.pendingPromise = makeAbortablePromise(fetchListsForItem());
    this.pendingPromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pending: false });
        }
      });

    if (lists.length > 0) {
      this.setState({ listsToDisplay: lists });
    }
  }

  componentDidUpdate(prevProps) {
    const { lists: prevLists } = prevProps;
    const { lists } = this.props;

    if (prevLists.length === 0 && lists.length > 0) {
      this.handleFilterLists(lists);
    }
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  handleShowConfirmation = (listId, listName) => event => {
    event.preventDefault();

    this.setState({ isConfirmationVisible: true, listId, listName });
  };

  handleCloseConfirmation = () =>
    this.setState({
      isConfirmationVisible: false,
      listId: null,
      listName: null
    });

  handleClosePanel = event => {
    const { onClose } = this.props;

    this.handleCloseConfirmation;
    onClose(event);
  };

  handleFilterLists = listsToDisplay => this.setState({ listsToDisplay });

  handleMoveToList = () => {
    const { listId: newListId } = this.state;
    const {
      data: { _id: itemId },
      match: {
        params: { id: listId }
      }
    } = this.props;

    return moveItemToList(itemId, listId, newListId);
  };

  render() {
    const {
      isConfirmationVisible,
      listName,
      listsToDisplay,
      pending
    } = this.state;
    const {
      data: { name: itemName },
      intl: { formatMessage },
      lists
    } = this.props;

    return (
      <div className="move-to-list-panel">
        {isConfirmationVisible ? (
          <Confirmation
            onCancel={this.handleCloseConfirmation}
            onConfirm={this.handleMoveToList}
            confirmLabel="list.list-item.move-button"
          >
            <FormattedMessage
              id="list.list-item.move-to-confirmation"
              values={{ item: itemName, list: listName }}
            />
          </Confirmation>
        ) : (
          <Fragment>
            <div className="move-to-list-panel__filter-box">
              <Filter
                buttonContent={<CloseIcon />}
                classes="move-to-list-panel__filter"
                elements={lists}
                onFilter={this.handleFilterLists}
                placeholder={formatMessage({
                  id: 'list.list-item.input-find-list'
                })}
              />
              <button
                className="primary-button"
                type="button"
                onClick={this.handleClosePanel}
              >
                <FormattedMessage id="common.button.cancel" />
              </button>
            </div>
            <div className="move-to-list-panel__lists">
              {pending ? (
                <Preloader />
              ) : (
                <ul>
                  {listsToDisplay.map(list => (
                    <li className="move-to-list-panel__list" key={list._id}>
                      <button
                        disabled={pending}
                        type="button"
                        onClick={this.handleShowConfirmation(
                          list._id,
                          list.name
                        )}
                        title={formatMessage(
                          {
                            id: 'list.list-item.move-list-button-title'
                          },
                          { list: list.name }
                        )}
                      >
                        {list.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

MoveToPanel.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object
    ])
  ),
  intl: IntlPropType.isRequired,
  lists: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  match: RouterMatchPropType.isRequired,

  fetchListsForItem: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;

  return {
    lists: getListsForItem(state, id)
  };
};

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    { fetchListsForItem }
  )
)(MoveToPanel);
