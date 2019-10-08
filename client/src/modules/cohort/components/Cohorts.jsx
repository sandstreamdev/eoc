import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import { CohortIcon } from 'assets/images/icons';
import {
  createCohort,
  fetchCohortsMetaData
} from 'modules/cohort/model/actions';
import { getActiveCohorts } from 'modules/cohort/model/selectors';
import { getCurrentUser } from 'modules/user/model/selectors';
import { UserPropType, IntlPropType } from 'common/constants/propTypes';
import CollectionView from 'common/components/CollectionView';
import FormDialog from 'common/components/FormDialog';
import Breadcrumbs from 'common/components/Breadcrumbs';
import { ColorType, Routes, ViewType } from 'common/constants/enums';
import ArchivedCohorts from './ArchivedCohorts';

class Cohorts extends Component {
  state = {
    isDialogVisible: false,
    pendingForCohortCreation: false,
    pendingForCohorts: false
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

  renderBreadcrumbs = () => {
    const breadcrumbs = [{ name: Routes.COHORTS, path: `/${Routes.COHORTS}` }];

    return <Breadcrumbs breadcrumbs={breadcrumbs} />;
  };

  render() {
    const {
      cohorts,
      intl: { formatMessage }
    } = this.props;
    const {
      isDialogVisible,
      pendingForCohortCreation,
      pendingForCohorts
    } = this.state;

    return (
      <Fragment>
        {this.renderBreadcrumbs()}
        <div className="wrapper">
          <div className="dashboard">
            <CollectionView
              color={ColorType.BROWN}
              icon={<CohortIcon />}
              items={cohorts}
              label={formatMessage({
                id: 'cohort.label'
              })}
              name="Cohorts"
              onAddNew={this.handleDialogVisibility}
              pending={pendingForCohorts}
              placeholder={formatMessage({
                id: 'cohort.cohorts.no-cohorts'
              })}
              route={Routes.COHORT}
              viewType={ViewType.TILES}
            />
            <ArchivedCohorts />
          </div>
        </div>
        {isDialogVisible && (
          <FormDialog
            onCancel={this.handleDialogVisibility}
            onConfirm={this.handleConfirm}
            pending={pendingForCohortCreation}
            title={
              pendingForCohortCreation
                ? formatMessage({ id: 'cohort.cohorts.adding' })
                : formatMessage({ id: 'cohort.cohorts.add' })
            }
          />
        )}
      </Fragment>
    );
  }
}

Cohorts.propTypes = {
  cohorts: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,
  intl: IntlPropType.isRequired,

  createCohort: PropTypes.func.isRequired,
  fetchCohortsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getActiveCohorts(state),
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  connect(
    mapStateToProps,
    {
      createCohort,
      fetchCohortsMetaData
    }
  )
)(Cohorts);
