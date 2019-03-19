import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar, { ToolbarLink } from 'common/components/Toolbar';
import { ArchiveIcon, CohortIcon, ListIcon } from 'assets/images/icons';
import EyeIcon from 'assets/images/eye-solid.svg';
import { createList, fetchListsMetaData } from 'modules/list/model/actions';
import {
  createCohort,
  fetchCohortsMetaData
} from 'modules/cohort/model/actions';
import { getLists } from 'modules/list/model/selectors';
import { getCohorts } from 'modules/cohort/model/selectors';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import GridList from 'common/components/GridList';
import { CardColorType } from 'common/components/CardItem';
import FormDialog, { FormDialogContext } from 'common/components/FormDialog';

class Dashboard extends Component {
  state = {
    dialogContext: ''
  };

  componentDidMount() {
    const { fetchCohortsMetaData, fetchListsMetaData } = this.props;

    fetchCohortsMetaData();
    fetchListsMetaData();
  }

  handleDialogContext = context => () =>
    this.setState({ dialogContext: context });

  handleConfirm = (title, description) => {
    const { dialogContext } = this.state;
    const {
      createCohort,
      createList,
      currentUser: { id }
    } = this.props;

    switch (dialogContext) {
      case FormDialogContext.CREATE_COHORT:
        createCohort(title, description, id);
        return this.hideDialog();
      case FormDialogContext.CREATE_LIST:
        createList(title, description, id);
        return this.hideDialog();
      default:
        break;
    }
  };

  hideDialog = () => this.handleDialogContext(null)();

  render() {
    const { lists, cohorts } = this.props;
    const { dialogContext } = this.state;

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
              name="Lists"
              onAddNew={this.handleDialogContext(FormDialogContext.CREATE_LIST)}
              placeholder="There are no lists yet!"
              route="list"
            />
            <GridList
              color={CardColorType.BROWN}
              icon={<CohortIcon />}
              items={cohorts}
              name="Cohorts"
              onAddNew={this.handleDialogContext(
                FormDialogContext.CREATE_COHORT
              )}
              placeholder="There are no cohorts yet!"
              route="cohort"
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
  cohorts: PropTypes.objectOf(PropTypes.object),
  currentUser: UserPropType.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),

  createCohort: PropTypes.func.isRequired,
  createList: PropTypes.func.isRequired,
  fetchCohortsMetaData: PropTypes.func.isRequired,
  fetchListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  currentUser: getCurrentUser(state),
  lists: getLists(state)
});

export default connect(
  mapStateToProps,
  {
    createCohort,
    createList,
    fetchCohortsMetaData,
    fetchListsMetaData
  }
)(Dashboard);
