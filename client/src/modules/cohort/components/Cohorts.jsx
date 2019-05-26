import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { CohortIcon } from 'assets/images/icons';
import {
  createCohort,
  fetchArchivedCohortsMetaData,
  fetchCohortsMetaData,
  removeArchivedCohortsMetaData
} from 'modules/cohort/model/actions';
import {
  getActiveCohorts,
  getArchivedCohorts
} from 'modules/cohort/model/selectors';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import CollectionView from 'common/components/CollectionView';
import FormDialog from 'common/components/FormDialog';
import { ColorType, Routes, ViewType } from 'common/constants/enums';

class Cohorts extends Component {
  state = {
    areArchivedCohortsVisible: false,
    isDialogVisible: false,
    pendingForCohortCreation: false,
    pendingForCohorts: false,
    pendingForArchivedCohorts: false
  };

  componentDidMount() {
    const { fetchCohortsMetaData } = this.props;

    this.setState({ pendingForCohorts: true });

    fetchCohortsMetaData().finally(() =>
      this.setState({ pendingForCohorts: false })
    );
  }

  handleDialogVisibility = () =>
    this.setState(({ isDialogVisible }) => ({
      isDialogVisible: !isDialogVisible
    }));

  handleConfirm = (name, description) => {
    const {
      createCohort,
      currentUser: { id: userId }
    } = this.props;
    const data = { description, userId, name };

    this.setState({ pendingForCohortCreation: true });

    createCohort(data).finally(() => {
      this.setState({ pendingForCohortCreation: false });
      this.handleDialogVisibility();
    });
  };

  handleArchivedCohortsVisibility = () =>
    this.setState(
      ({ areArchivedCohortsVisible }) => ({
        areArchivedCohortsVisible: !areArchivedCohortsVisible
      }),
      () => this.handleArchivedCohortsData()
    );

  handleArchivedCohortsData = () => {
    const { areArchivedCohortsVisible } = this.state;
    const {
      fetchArchivedCohortsMetaData,
      removeArchivedCohortsMetaData
    } = this.props;

    if (areArchivedCohortsVisible) {
      this.setState({ pendingForArchivedCohorts: true });

      fetchArchivedCohortsMetaData().finally(() =>
        this.setState({ pendingForArchivedCohorts: false })
      );
    } else {
      removeArchivedCohortsMetaData();
    }
  };

  render() {
    const { archivedCohorts, cohorts } = this.props;
    const {
      areArchivedCohortsVisible,
      isDialogVisible,
      pendingForArchivedCohorts,
      pendingForCohortCreation,
      pendingForCohorts
    } = this.state;

    return (
      <Fragment>
        <div className="wrapper">
          <div className="dashboard">
            <CollectionView
              color={ColorType.BROWN}
              icon={<CohortIcon />}
              items={cohorts}
              name="Cohorts"
              onAddNew={this.handleDialogVisibility}
              pending={pendingForCohorts}
              placeholder="There are no cohorts yet!"
              route={Routes.COHORT}
              viewType={ViewType.TILES}
            />
            <button
              className="link-button"
              onClick={this.handleArchivedCohortsVisibility}
              type="button"
            >
              {` ${
                areArchivedCohortsVisible ? 'hide' : 'show'
              } archived cohorts`}
            </button>
            {areArchivedCohortsVisible && (
              <CollectionView
                color={ColorType.GRAY}
                icon={<CohortIcon />}
                items={archivedCohorts}
                name="Archived cohorts"
                pending={pendingForArchivedCohorts}
                placeholder="You have no archived cohorts!"
                route={Routes.COHORT}
                viewType={ViewType.TILES}
              />
            )}
          </div>
        </div>
        {isDialogVisible && (
          <FormDialog
            onCancel={this.handleDialogVisibility}
            onConfirm={this.handleConfirm}
            pending={pendingForCohortCreation}
            title={`${pendingForCohortCreation ? 'Adding' : 'Add'} new cohort`}
          />
        )}
      </Fragment>
    );
  }
}

Cohorts.propTypes = {
  archivedCohorts: PropTypes.objectOf(PropTypes.object),
  cohorts: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,

  createCohort: PropTypes.func.isRequired,
  fetchArchivedCohortsMetaData: PropTypes.func.isRequired,
  fetchCohortsMetaData: PropTypes.func.isRequired,
  removeArchivedCohortsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  archivedCohorts: getArchivedCohorts(state),
  cohorts: getActiveCohorts(state),
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  {
    createCohort,
    fetchArchivedCohortsMetaData,
    fetchCohortsMetaData,
    removeArchivedCohortsMetaData
  }
)(Cohorts);
