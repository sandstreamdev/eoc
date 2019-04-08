import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import Toolbar, { ToolbarLink } from 'common/components/Toolbar';
import ItemsContainer from 'modules/list/components/ItemsContainer';
import { getList, getItems } from 'modules/list/model/selectors';
import InputBar from 'modules/list/components/InputBar';
import { archiveList, fetchListData } from 'modules/list/model/actions';
import Dialog, { DialogContext } from 'common/components/Dialog';
import { CohortIcon } from 'assets/images/icons';
import { noOp } from 'common/utils/noOp';
import ArchivedList from 'modules/list/components/ArchivedList';
import { RouterMatchPropType } from 'common/constants/propTypes';
import ArrowLeftIcon from 'assets/images/arrow-left-solid.svg';
import ListHeader from './components/ListHeader';

export const ListType = Object.freeze({
  PRIVATE: 'private',
  PUBLIC: 'public'
});

class List extends Component {
  state = {
    dialogContext: null
  };

  componentDidMount() {
    if (this.checkIfArchived()) {
      this.fetchData();
    }
  }

  fetchData = () => {
    const {
      fetchListData,
      match: {
        params: { id }
      }
    } = this.props;
    fetchListData(id);
  };

  archiveListHandler = listId => () => {
    const { archiveList } = this.props;
    archiveList(listId)
      .then(this.hideDialog())
      .catch(noOp);
  };

  checkIfArchived = () => {
    const { list } = this.props;
    return !list || (list && !list.isArchived);
  };

  checkIfOwner = () => {
    const { list } = this.props;
    return list && list.isOwner;
  };

  handleDialogContext = context => () =>
    this.setState({ dialogContext: context });

  hideDialog = () => this.handleDialogContext(null)();

  render() {
    const { dialogContext } = this.state;
    const {
      items,
      match: {
        params: { id: listId }
      },
      list
    } = this.props;

    if (!list) {
      return null;
    }

    const { cohortId, isArchived, name } = list;
    const orderedItems = items ? items.filter(item => item.isOrdered) : [];
    const listItems = items ? items.filter(item => !item.isOrdered) : [];

    return (
      <Fragment>
        <Toolbar>
          {cohortId && (
            <ToolbarLink
              additionalIconSrc={ArrowLeftIcon}
              mainIcon={<CohortIcon />}
              path={`/cohort/${cohortId}`}
              title="Go back to cohort"
            />
          )}
        </Toolbar>
        {isArchived ? (
          <ArchivedList listId={listId} name={name} />
        ) : (
          <div className="wrapper">
            <div className="list">
              <ListHeader details={list} />
              <div className="list__items">
                <ItemsContainer items={listItems}>
                  <InputBar />
                </ItemsContainer>
                <ItemsContainer archived items={orderedItems} />
                <button
                  className="link-button"
                  onClick={this.handleDialogContext(DialogContext.ARCHIVE)}
                  type="button"
                >
                  {`Archive the "${name}" list`}
                </button>
              </div>
            </div>
          </div>
        )}
        {dialogContext === DialogContext.ARCHIVE && (
          <Dialog
            onCancel={this.hideDialog}
            onConfirm={this.archiveListHandler(listId)}
            title={`Do you really want to archive the "${name}" list?`}
          />
        )}
      </Fragment>
    );
  }
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  list: PropTypes.objectOf(PropTypes.any),
  match: RouterMatchPropType.isRequired,

  archiveList: PropTypes.func.isRequired,
  fetchListData: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  list: getList(state, ownProps.match.params.id),
  items: getItems(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { archiveList, fetchListData }
  )(List)
);
