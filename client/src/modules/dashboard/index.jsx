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
    formDialogVisibility: false,
    formDialogContext: ''
  };

  componentDidMount() {
    const { fetchCohortsMetaData, fetchListsMetaData } = this.props;

    fetchCohortsMetaData();
    fetchListsMetaData();
  }

  handleFormDialogVisibility = context => {
    const { formDialogVisibility } = this.state;

    formDialogVisibility
      ? this.setState({
          formDialogVisibility: false,
          formDialogContext: ''
        })
      : this.setState({
          formDialogVisibility: true,
          formDialogContext: context
        });
  };

  handleConfirm = (title, description) => {
    const { formDialogContext } = this.state;
    const {
      createCohort,
      createList,
      currentUser: { id }
    } = this.props;

    if (formDialogContext === FormDialogContext.COHORT) {
      createCohort(title, description, id);
      return this.handleFormDialogVisibility();
    }

    createList(title, description, id);
    this.handleFormDialogVisibility();
  };

  handleOnAddNew = context => () => {
    this.handleFormDialogVisibility(context);
  };

  render() {
    const { lists, cohorts } = this.props;
    const { formDialogContext, formDialogVisibility } = this.state;

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
              onAddNew={this.handleOnAddNew(FormDialogContext.LIST)}
              placeholder="There are no lists yet!"
              route="list"
              withPlusTile
            />
            <GridList
              color={CardColorType.BROWN}
              icon={<CohortIcon />}
              items={cohorts}
              name="Cohorts"
              onAddNew={this.handleOnAddNew(FormDialogContext.COHORT)}
              placeholder="There are no cohorts yet!"
              route="cohort"
              withPlusTile
            />
          </div>
        </div>
        {formDialogVisibility && (
          <FormDialog
            onCancel={this.handleFormDialogVisibility}
            onConfirm={this.handleConfirm}
            title={`Add new ${formDialogContext}`}
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
