import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import { ListIcon } from 'assets/images/icons';
import {
  addListsToStoreWS,
  addListToStoreWS,
  createList,
  fetchArchivedListsMetaData,
  fetchListsMetaData,
  removeArchivedListsMetaData
} from 'modules/list/model/actions';
import {
  getArchivedLists,
  getCohortsLists,
  getPrivateLists
} from 'modules/list/model/selectors';
import CollectionView from 'common/components/CollectionView';
import FormDialog from 'common/components/FormDialog';
import { ColorType, Routes } from 'common/constants/enums';
import Breadcrumbs from 'common/components/Breadcrumbs';
import { IntlPropType, UserPropType } from 'common/constants/propTypes';
import withSocket from 'common/hoc/withSocket';
import { CohortActionTypes } from 'modules/cohort/model/actionTypes';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { ListActionTypes } from 'modules/list/model/actionTypes';

class Dashboard extends Component {
  state = {
    areArchivedListsVisible: false,
    isDialogVisible: false,
    pendingForLists: false,
    pendingForArchivedLists: false,
    pendingForListCreation: false
  };

  componentDidMount() {
    const {
      currentUser: { id },
      fetchListsMetaData,
      socket
    } = this.props;

    this.setState({ pendingForLists: true });

    fetchListsMetaData().finally(() =>
      this.setState({ pendingForLists: false })
    );

    socket.emit('enterDashboardView', id);
    this.receiveWSEvents();
  }

  componentWillUnmount() {
    const {
      currentUser: { id },
      socket
    } = this.props;

    socket.emit('leavingDashboardView', id);
  }

  receiveWSEvents = () => {
    const { addListsToStoreWS, addListToStoreWS, socket } = this.props;

    socket.on(CohortActionTypes.ADD_MEMBER_SUCCESS, data =>
      addListsToStoreWS(data)
    );

    socket.on(ListActionTypes.ADD_VIEWER_SUCCESS, data =>
      addListToStoreWS(data)
    );
  };

  handleDialogVisibility = () =>
    this.setState(({ isDialogVisible }) => ({
      isDialogVisible: !isDialogVisible
    }));

  handleConfirm = (name, description) => {
    const { createList } = this.props;
    const data = { description, name };

    this.setState({ pendingForListCreation: true });

    createList(data).finally(() => {
      this.setState({ pendingForListCreation: false });
      this.handleDialogVisibility();
    });
  };

  handleArchivedListsVisibility = () =>
    this.setState(
      ({ areArchivedListsVisible }) => ({
        areArchivedListsVisible: !areArchivedListsVisible
      }),
      () => this.handleArchivedListsData()
    );

  handleArchivedListsData = () => {
    const { areArchivedListsVisible } = this.state;
    const {
      fetchArchivedListsMetaData,
      removeArchivedListsMetaData
    } = this.props;

    if (areArchivedListsVisible) {
      this.setState({ pendingForArchivedLists: true });

      fetchArchivedListsMetaData().finally(() =>
        this.setState({ pendingForArchivedLists: false })
      );
    } else {
      removeArchivedListsMetaData();
    }
  };

  render() {
    const {
      archivedLists,
      cohortLists,
      intl: { formatMessage },
      privateLists,
      viewType
    } = this.props;
    const {
      areArchivedListsVisible,
      isDialogVisible,
      pendingForArchivedLists,
      pendingForListCreation,
      pendingForLists
    } = this.state;
    const breadcrumbs = [
      { name: Routes.DASHBOARD, path: `/${Routes.DASHBOARD}` }
    ];

    return (
      <Fragment>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <div className="wrapper">
          <div className="dashboard">
            <CollectionView
              color={ColorType.ORANGE}
              icon={<ListIcon />}
              items={privateLists}
              name="Private Sacks"
              onAddNew={this.handleDialogVisibility}
              pending={pendingForLists}
              placeholder={formatMessage({ id: 'dashboard.index.no-sacks' })}
              route={Routes.LIST}
              viewType={viewType}
            />
            <CollectionView
              color={ColorType.ORANGE}
              icon={<ListIcon />}
              items={cohortLists}
              name="Cohorts' Sacks"
              pending={pendingForLists}
              placeholder={formatMessage({ id: 'dashboard.index.no-sacks' })}
              route={Routes.LIST}
              viewType={viewType}
            />
            <button
              className="link-button"
              onClick={this.handleArchivedListsVisibility}
              type="button"
            >
              {areArchivedListsVisible
                ? formatMessage({ id: 'dashboard.index.hide-arch-sacks' })
                : formatMessage({ id: 'dashboard.index.show-arch-sacks' })}
            </button>
            {areArchivedListsVisible && (
              <CollectionView
                color={ColorType.GRAY}
                icon={<ListIcon />}
                items={archivedLists}
                name="Archived Sacks"
                pending={pendingForArchivedLists}
                placeholder={formatMessage({
                  id: 'dashboard.index.no-arch-sacks'
                })}
                route={Routes.LIST}
                viewType={viewType}
              />
            )}
          </div>
        </div>
        {isDialogVisible && (
          <FormDialog
            onCancel={this.handleDialogVisibility}
            onConfirm={this.handleConfirm}
            pending={pendingForListCreation}
            title={
              pendingForListCreation
                ? formatMessage({ id: 'dashboard.index.adding' })
                : formatMessage({ id: 'dashboard.index.add' })
            }
          />
        )}
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  archivedLists: PropTypes.objectOf(PropTypes.object),
  cohortLists: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,
  intl: IntlPropType.isRequired,
  privateLists: PropTypes.objectOf(PropTypes.object),
  socket: PropTypes.objectOf(PropTypes.any),
  viewType: PropTypes.string.isRequired,

  addListsToStoreWS: PropTypes.func.isRequired,
  addListToStoreWS: PropTypes.func.isRequired,
  createList: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  removeArchivedListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  archivedLists: getArchivedLists(state),
  cohortLists: getCohortsLists(state),
  currentUser: getCurrentUser(state),
  privateLists: getPrivateLists(state)
});

export default _flowRight(
  withSocket,
  injectIntl,
  connect(
    mapStateToProps,
    {
      createList,
      addListToStoreWS,
      addListsToStoreWS,
      fetchArchivedListsMetaData,
      fetchListsMetaData,
      removeArchivedListsMetaData
    }
  )
)(Dashboard);
