import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar, { ToolbarLink } from 'common/components/Toolbar';
import { ArchiveIcon, CohortIcon, ListIcon } from 'assets/images/icons';
import EyeIcon from 'assets/images/eye-solid.svg';
import {
  createList,
  fetchArchivedListsMetaData,
  fetchListsMetaData,
  removeArchivedListsMetaData
} from 'modules/list/model/actions';
import {
  createCohort,
  fetchCohortsMetaData
} from 'modules/cohort/model/actions';
import { getActiveLists, getArchivedLists } from 'modules/list/model/selectors';
import { getActiveCohorts } from 'modules/cohort/model/selectors';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import GridList from 'common/components/GridList';
import { CardColorType } from 'common/components/CardItem';
import FormDialog, { FormDialogContext } from 'common/components/FormDialog';
import { Routes } from 'common/constants/enums';

class Dashboard extends Component {
  state = {
    areArchivedListVisible: false,
    dialogContext: ''
  };

  componentDidMount() {
    const { fetchCohortsMetaData, fetchListsMetaData } = this.props;

    fetchCohortsMetaData();
    fetchListsMetaData();
  }

  handleDialogContext = context => () =>
    this.setState({ dialogContext: context });

  handleConfirm = (name, description) => {
    const { dialogContext } = this.state;
    const {
      createCohort,
      createList,
      currentUser: { id: userId }
    } = this.props;
    const data = { description, userId, name };

    switch (dialogContext) {
      case FormDialogContext.CREATE_COHORT:
        createCohort(data);
        break;
      case FormDialogContext.CREATE_LIST:
        createList(data);
        break;
      default:
        break;
    }

    this.hideDialog();
  };

  hideDialog = () => this.handleDialogContext(null)();

  handleArchivedListsVisibility = () => {
    this.setState(({ areArchivedListVisible }) => ({
      areArchivedListVisible: !areArchivedListVisible
    }));
    this.handleArchivedListsData();
  };

  handleArchivedListsData = id => {
    const { areArchivedListVisible } = this.state;
    const {
      fetchArchivedListsMetaData,
      removeArchivedListsMetaData
    } = this.props;
    !areArchivedListVisible
      ? fetchArchivedListsMetaData()
      : removeArchivedListsMetaData();
  };

  render() {
    const { archivedLists, lists, cohorts } = this.props;
    const { areArchivedListVisible, dialogContext } = this.state;

    return (
      <Fragment>
        <Toolbar isHomePage>
          <ToolbarLink
            additionalIconSrc={EyeIcon}
            mainIcon={<ArchiveIcon />}
            path="/archived"
            title="Go to archived"
          />
        </Toolbar>
        <div className="wrapper">
          <div className="dashboard">
            <GridList
              color={CardColorType.ORANGE}
              icon={<ListIcon />}
              items={lists}
              name="Private Lists"
              onAddNew={this.handleDialogContext(FormDialogContext.CREATE_LIST)}
              placeholder="There are no lists yet!"
              route={Routes.LIST}
            />
            <button
              className="link-button"
              onClick={this.handleArchivedListsVisibility}
              type="button"
            >
              {` ${areArchivedListVisible ? 'hide' : 'show'} archived lists`}
            </button>
            {areArchivedListVisible && (
              <GridList
                color={CardColorType.ARCHIVED}
                icon={<ListIcon />}
                items={archivedLists}
                name="Archived lists"
                placeholder="You have no archived lists!"
                route={Routes.LIST}
              />
            )}
            <GridList
              color={CardColorType.BROWN}
              icon={<CohortIcon />}
              items={cohorts}
              name="Cohorts"
              onAddNew={this.handleDialogContext(
                FormDialogContext.CREATE_COHORT
              )}
              placeholder="There are no cohorts yet!"
              route={Routes.COHORT}
            />
          </div>
        </div>
        {dialogContext && (
          <FormDialog
            onCancel={this.handleDialogContext(null)}
            onConfirm={this.handleConfirm}
            title={`Add new ${
              dialogContext === FormDialogContext.CREATE_COHORT
                ? 'cohort'
                : 'list'
            }`}
          />
        )}
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  archivedLists: PropTypes.objectOf(PropTypes.object),
  cohorts: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),

  createCohort: PropTypes.func.isRequired,
  createList: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired,
  fetchCohortsMetaData: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired,
  removeArchivedListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  archivedLists: getArchivedLists(state),
  cohorts: getActiveCohorts(state),
  currentUser: getCurrentUser(state),
  lists: getActiveLists(state)
});

export default connect(
  mapStateToProps,
  {
    createCohort,
    createList,
    fetchArchivedListsMetaData,
    fetchCohortsMetaData,
    fetchListsMetaData,
    removeArchivedListsMetaData
  }
)(Dashboard);
