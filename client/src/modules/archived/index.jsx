import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar from 'common/components/Toolbar';
import { fetchArchivedCohortsMetaData } from 'modules/cohort/model/actions';
import { getArchivedCohorts } from 'modules/cohort/model/selectors';
import { CohortIcon } from 'assets/images/icons';
import GridList from 'common/components/GridList';
import { CardColorType } from 'common/components/CardItem';
import { Routes } from 'common/constants/enums';

class Archived extends PureComponent {
  componentDidMount() {
    const { fetchArchivedCohortsMetaData } = this.props;

    fetchArchivedCohortsMetaData();
  }

  render() {
    const { cohorts } = this.props;

    return (
      <Fragment>
        <Toolbar />
        <div className="wrapper">
          <GridList
            color={CardColorType.BROWN}
            icon={<CohortIcon />}
            items={cohorts}
            name="Archived Cohorts"
            placeholder="There are no archived cohorts!"
            route={Routes.COHORT}
          />
        </div>
      </Fragment>
    );
  }
}

Archived.propTypes = {
  cohorts: PropTypes.objectOf(PropTypes.object),

  fetchArchivedCohortsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getArchivedCohorts(state)
});

export default connect(
  mapStateToProps,
  { fetchArchivedCohortsMetaData }
)(Archived);
