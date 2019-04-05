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
    showArchivedLists: false,
    isDialogVisible: false
  };

  componentDidMount() {
    const { fetchListsMetaData } = this.props;

    fetchListsMetaData();
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
    createList(data);
    this.handleDialogVisibility();
  };

  handleArchivedListsVisibility = () => {
    this.setState(
      ({ showArchivedLists }) => ({
        showArchivedLists: !showArchivedLists
      }),
      () => this.handleArchivedListsData()
    );
  };

  handleArchivedListsData = () => {
    const { showArchivedLists } = this.state;
    const {
      fetchArchivedListsMetaData,
      removeArchivedListsMetaData
    } = this.props;
    const action = showArchivedLists
      ? fetchArchivedListsMetaData
      : removeArchivedListsMetaData;

    action();
  };

  render() {
    const { archivedLists, privateLists, cohortLists } = this.props;
    const { showArchivedLists, isDialogVisible } = this.state;

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
              placeholder="There are no lists yet!"
              route={Routes.LIST}
            />
            <GridList
              color={CardColorType.ORANGE}
              icon={<ListIcon />}
              items={cohortLists}
              name="Cohort's Lists"
              placeholder="There are no lists yet!"
              route={Routes.LIST}
            />
            <button
              className="link-button"
              onClick={this.handleArchivedListsVisibility}
              type="button"
            >
              {` ${showArchivedLists ? 'hide' : 'show'} archived lists`}
            </button>
            {showArchivedLists && (
              <GridList
                color={CardColorType.ARCHIVED}
                icon={<ListIcon />}
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
            title="Add new cohort"
          />
        )}
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  archivedLists: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,
  privateLists: PropTypes.objectOf(PropTypes.object),
  cohortLists: PropTypes.objectOf(PropTypes.object),

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
