import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import { ColorType, Routes, ViewType } from 'common/constants/enums';
import CollectionView from 'common/components/CollectionView';
import { CohortIcon } from 'assets/images/icons';
import { IntlPropType } from 'common/constants/propTypes';
import {
  fetchArchivedCohortsMetaData,
  removeArchivedCohortsMetaData
} from 'modules/cohort/model/actions';
import { getArchivedCohorts } from 'modules/cohort/model/selectors';

class ArchivedCohorts extends PureComponent {
  state = {
    areArchivedCohortsVisible: false,
    pendingForArchivedCohorts: false
  };

  handleArchivedCohortsVisibility = () =>
    this.setState(
      ({ areArchivedCohortsVisible }) => ({
        areArchivedCohortsVisible: !areArchivedCohortsVisible
      }),
      this.handleArchivedCohortsData
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
    const {
      archivedCohorts,
      intl: { formatMessage }
    } = this.props;
    const { areArchivedCohortsVisible, pendingForArchivedCohorts } = this.state;

    return (
      <>
        <button
          className="link-button"
          onClick={this.handleArchivedCohortsVisibility}
          type="button"
        >
          {areArchivedCohortsVisible ? (
            <FormattedMessage id="cohort.cohorts.hide-archived" />
          ) : (
            <FormattedMessage id="cohort.cohorts.show-archived" />
          )}
        </button>
        {areArchivedCohortsVisible && (
          <CollectionView
            color={ColorType.GRAY}
            icon={<CohortIcon />}
            items={archivedCohorts}
            name="Archived cohorts"
            pending={pendingForArchivedCohorts}
            placeholder={formatMessage({
              id: 'cohort.cohorts.no-arch-cohorts'
            })}
            route={Routes.COHORT}
            viewType={ViewType.TILES}
          />
        )}
      </>
    );
  }
}

ArchivedCohorts.propTypes = {
  archivedCohorts: PropTypes.objectOf(PropTypes.object),
  intl: IntlPropType.isRequired,

  fetchArchivedCohortsMetaData: PropTypes.func.isRequired,
  removeArchivedCohortsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  archivedCohorts: getArchivedCohorts(state)
});

export default _flowRight(
  injectIntl,
  connect(
    mapStateToProps,
    {
      fetchArchivedCohortsMetaData,
      removeArchivedCohortsMetaData
    }
  )
)(ArchivedCohorts);
