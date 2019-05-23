import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar, { ToolbarItem } from 'common/components/Toolbar';
import { ListIcon, ListModeIcon, TilesModeIcon } from 'assets/images/icons';
import {
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
import GridList from 'common/components/GridList';
import FormDialog from 'common/components/FormDialog';
import { ColorType, Routes } from 'common/constants/enums';

class Dashboard extends Component {
  state = {
    areArchivedListsVisible: false,
    isDialogVisible: false,
    pendingForLists: false,
    pendingForArchivedLists: false,
    pendingForListCreation: false
  };

  componentDidMount() {
    const { fetchListsMetaData } = this.props;

    this.setState({ pendingForLists: true });

    fetchListsMetaData().finally(() =>
      this.setState({ pendingForLists: false })
    );
  }

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
      listMode,
      onListModeChange,
      privateLists
    } = this.props;
    const {
      areArchivedListsVisible,
      isDialogVisible,
      pendingForArchivedLists,
      pendingForListCreation,
      pendingForLists
    } = this.state;

    return (
      <Fragment>
        <Toolbar>
          <ToolbarItem
            mainIcon={listMode ? <TilesModeIcon /> : <ListModeIcon />}
            onClick={onListModeChange}
            title={`Change to ${listMode ? 'tiles' : 'list'} view`}
          />
        </Toolbar>
        <div className="wrapper">
          <div className="dashboard">
            <GridList
              color={ColorType.ORANGE}
              icon={<ListIcon />}
              items={privateLists}
              listMode={listMode}
              name="Private Sacks"
              onAddNew={this.handleDialogVisibility}
              pending={pendingForLists}
              placeholder="There are no sacks yet!"
              route={Routes.LIST}
            />
            <GridList
              color={ColorType.ORANGE}
              icon={<ListIcon />}
              items={cohortLists}
              listMode={listMode}
              name="Cohorts' Sacks"
              pending={pendingForLists}
              placeholder="There are no sacks yet!"
              route={Routes.LIST}
            />
            <button
              className="link-button"
              onClick={this.handleArchivedListsVisibility}
              type="button"
            >
              {` ${areArchivedListsVisible ? 'hide' : 'show'} archived sacks`}
            </button>
            {areArchivedListsVisible && (
              <GridList
                color={ColorType.GRAY}
                icon={<ListIcon />}
                items={archivedLists}
                listMode={listMode}
                name="Archived Sacks"
                pending={pendingForArchivedLists}
                placeholder="You have no archived sacks!"
                route={Routes.LIST}
              />
            )}
          </div>
        </div>
        {isDialogVisible && (
          <FormDialog
            onCancel={this.handleDialogVisibility}
            onConfirm={this.handleConfirm}
            pending={pendingForListCreation}
            title={`${pendingForListCreation ? 'Adding' : 'Add'} new sack`}
          />
        )}
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  archivedLists: PropTypes.objectOf(PropTypes.object),
  cohortLists: PropTypes.objectOf(PropTypes.object),
  listMode: PropTypes.bool,
  privateLists: PropTypes.objectOf(PropTypes.object),

  createList: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  onListModeChange: PropTypes.func.isRequired,
  removeArchivedListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  archivedLists: getArchivedLists(state),
  cohortLists: getCohortsLists(state),
  privateLists: getPrivateLists(state)
});

export default connect(
  mapStateToProps,
  {
    createList,
    fetchArchivedListsMetaData,
    fetchListsMetaData,
    removeArchivedListsMetaData
  }
)(Dashboard);
