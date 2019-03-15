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
import FormDialog from 'common/components/FormDialog';

const CreationFormContext = Object.freeze({
  COHORT: 'cohort',
  LIST: 'list'
});

class Dashboard extends Component {
  state = {
    creationFormVisibility: false,
    creationFormContext: ''
  };

  componentDidMount() {
    const { fetchCohortsMetaData, fetchListsMetaData } = this.props;

    fetchCohortsMetaData();
    fetchListsMetaData();
  }

  handleCreationFormVisibility = context => {
    const { creationFormVisibility } = this.state;

    creationFormVisibility
      ? this.setState({
          creationFormVisibility: false,
          creationFormContext: ''
        })
      : this.setState({
          creationFormVisibility: true,
          creationFormContext: context
        });
  };

  handleFormSubmission = (title, description) => {
    const { creationFormContext } = this.state;
    const {
      createCohort,
      createList,
      currentUser: { id }
    } = this.props;

    if (creationFormContext === CreationFormContext.COHORT) {
      createCohort(title, description, id);
      return this.handleCreationFormVisibility();
    }

    createList(title, description, id);
    this.handleCreationFormVisibility();
  };

  render() {
    const { lists, cohorts } = this.props;
    const { creationFormContext, creationFormVisibility } = this.state;

    return (
      <Fragment>
        <Toolbar isHomePage>
          <ToolbarLink
            additionalIconSrc={EyeIcon}
            mainIcon={<ArchiveIcon />}
            path="/archived"
          />
        </Toolbar>
        <div className="wrapper">
          <div className="dashboard">
            <GridList
              color={CardColorType.ORANGE}
              icon={<ListIcon />}
              items={lists}
              name="Lists"
              onAddNew={() =>
                this.handleCreationFormVisibility(CreationFormContext.LIST)
              }
              placeholder="There are no lists yet!"
              route="list"
            />
            <GridList
              color={CardColorType.BROWN}
              icon={<CohortIcon />}
              items={cohorts}
              name="Cohorts"
              onAddNew={() =>
                this.handleCreationFormVisibility(CreationFormContext.COHORT)
              }
              placeholder="There are no cohorts yet!"
              route="cohort"
            />
          </div>
        </div>
        {creationFormVisibility && (
          <FormDialog
            onCancel={this.handleCreationFormVisibility}
            onConfirm={this.handleFormSubmission}
            title={`Add new ${creationFormContext}`}
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
    fetchListsMetaData,
    fetchCohortsMetaData
  }
)(Dashboard);
