import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar from 'common/components/Toolbar';
import { ListIcon } from 'assets/images/icons';
import {
  createList,
  fetchArchivedListsMetaData,
  fetchListsMetaData,
  removeArchivedListsMetaData
} from 'modules/list/model/actions';
import {
  getArchivedLists,
  getCohortLists,
  getPrivateLists
} from 'modules/list/model/selectors';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import GridList from 'common/components/GridList';
import { CardColorType } from 'common/components/CardItem';
import FormDialog from 'common/components/FormDialog';
import { Routes } from 'common/constants/enums';

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
    const {
      createList,
      currentUser: { id: userId }
    } = this.props;
    const data = { description, userId, name };

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
    const { archivedLists, cohortLists, privateLists } = this.props;
    const {
      areArchivedListsVisible,
      isDialogVisible,
      pendingForArchivedLists,
      pendingForListCreation,
      pendingForLists
    } = this.state;

    return (
      <Fragment>
        <Toolbar isHomePage />
        <div className="wrapper">
          <div className="dashboard">
            <GridList
              color={CardColorType.ORANGE}
              icon={<ListIcon />}
              items={privateLists}
              name="Private Lists"
              onAddNew={this.handleDialogVisibility}
              pending={pendingForLists}
              placeholder="There are no lists yet!"
              route={Routes.LIST}
            />
            <GridList
              color={CardColorType.ORANGE}
              icon={<ListIcon />}
              items={cohortLists}
              name="Cohorts' Lists"
              placeholder="There are no lists yet!"
              pending={pendingForLists}
              route={Routes.LIST}
            />
            <button
              className="link-button"
              onClick={this.handleArchivedListsVisibility}
              type="button"
            >
              {` ${areArchivedListsVisible ? 'hide' : 'show'} archived lists`}
            </button>
            {areArchivedListsVisible && (
              <GridList
                color={CardColorType.ARCHIVED}
                icon={<ListIcon />}
                pending={pendingForArchivedLists}
                items={archivedLists}
                name="Archived lists"
                placeholder="You have no archived lists!"
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
            title={`${pendingForListCreation ? 'Adding' : 'Add'} new list`}
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
  privateLists: PropTypes.objectOf(PropTypes.object),

  createList: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  removeArchivedListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  archivedLists: getArchivedLists(state),
  cohortLists: getCohortLists(state),
  currentUser: getCurrentUser(state),
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
