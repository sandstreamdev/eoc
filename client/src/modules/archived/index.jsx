import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar from 'common/components/Toolbar';
import { fetchArchivedListsMetaData } from 'modules/list/model/actions';
import { fetchArchivedCohortsMetaData } from 'modules/cohort/model/actions';
import { getLists } from 'modules/list/model/selectors';
import { getCohorts } from 'modules/cohort/model/selectors';
import { CohortIcon, ListIcon } from 'assets/images/icons';
import GridList from 'common/components/GridList';
import { CardColorType } from 'common/components/CardItem';

class Archived extends PureComponent {
  componentDidMount() {
    const {
      fetchArchivedCohortsMetaData,
      fetchArchivedListsMetaData
    } = this.props;

    fetchArchivedCohortsMetaData();
    fetchArchivedListsMetaData();
  }

  render() {
    const { cohorts, lists } = this.props;

    return (
      <Fragment>
        <Toolbar />
        <div className="wrapper">
          <GridList
            color={CardColorType.ORANGE}
            icon={<ListIcon />}
            items={lists}
            name="Archived Lists"
            placeholder="There are no archived lists!"
            route="list"
          />
          <GridList
            color={CardColorType.BROWN}
            icon={<CohortIcon />}
            items={cohorts}
            name="Archived Cohorts"
            placeholder="There are no archived cohorts!"
            route="cohort"
          />
        </div>
      </Fragment>
    );
  }
}

Archived.propTypes = {
  cohorts: PropTypes.objectOf(PropTypes.object),
  lists: PropTypes.objectOf(PropTypes.object),

  fetchArchivedCohortsMetaData: PropTypes.func.isRequired,
  fetchArchivedListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  lists: getLists(state)
});

export default connect(
  mapStateToProps,
  { fetchArchivedCohortsMetaData, fetchArchivedListsMetaData }
)(Archived);
