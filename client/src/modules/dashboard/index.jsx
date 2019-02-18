import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _map from 'lodash/map';

import { SvgIcon } from 'assets/images/icons';
import { fetchShoppingListsMetaData } from 'modules/shopping-list/model/actions';
import { fetchCohorts } from 'modules/cohort/model/actions';
import { getShoppingLists } from 'modules/shopping-list/model/selectors';
import { getCohorts } from 'modules/cohort/model/selectors';
import CardItem from './CardItem';
import Toolbar from 'app/components/Toolbar/Toolbar';
import { IconType } from 'common/constants/enums';

class Dashboard extends Component {
  componentDidMount() {
    const { fetchShoppingListsMetaData, fetchCohorts } = this.props;

    fetchShoppingListsMetaData();
    fetchCohorts();
  }

  showCreateForm = () => {};

  render() {
    const { shoppingLists, cohorts } = this.props;

    return (
      <Fragment>
        <Toolbar isHomePage />
        <div className="wrapper">
          <div className="dashboard">
            <h2 className="dashboard__heading">
              <SvgIcon icon={IconType.LIST} />
              Lists
            </h2>
            <ul className="dashboard__list">
              {_map(shoppingLists, item => (
                <li className="dashboard__list-item" key={item._id}>
                  <Link to={`list/${item._id}`}>
                    <CardItem name={item.name} />
                  </Link>
                </li>
              ))}
            </ul>
            <h2 className="dashboard__heading">
              <SvgIcon icon={IconType.COHORT} />
              Cohorts
            </h2>
            <ul className="dashboard__list">
              {cohorts.map(cohort => (
                <li className="dashboard__list-item" key={cohort._id}>
                  <CardItem name={cohort.name} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

Dashboard.propTypes = {
  cohorts: PropTypes.arrayOf(PropTypes.object),
  shoppingLists: PropTypes.objectOf(PropTypes.object),

  fetchCohorts: PropTypes.func.isRequired,
  fetchShoppingListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  cohorts: getCohorts(state),
  shoppingLists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  { fetchShoppingListsMetaData, fetchCohorts }
)(Dashboard);
