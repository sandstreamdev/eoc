import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';

import Toolbar from 'common/components/Toolbar';
import { fetchCohortDetails } from './model/actions';
import { getListsForGivenCohort } from 'modules/shopping-list/model/selectors';
import CardItem from 'common/components/CardItem';
import { CohortIcon } from 'assets/images/icons';
import { getCohortDetails } from './model/selectors';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';

class Cohort extends PureComponent {
  componentDidMount() {
    const {
      fetchCohortDetails,
      match: {
        params: { id }
      }
    } = this.props;

    fetchCohortDetails(id);
  }

  render() {
    const { cohortDetails, lists } = this.props;
    const description =
      cohortDetails && cohortDetails.description
        ? cohortDetails.description
        : null;
    const name =
      cohortDetails && cohortDetails.name ? cohortDetails.name : null;
    console.log(lists);
    return (
      <Fragment>
        <Toolbar />
        <div className="wrapper">
          <div className="cohort">
            <h2 className="cohort__heading">
              <CohortIcon />
              {name}
            </h2>
            <p className="cohort__description">{description}</p>
            {_isEmpty(lists) ? (
              <MessageBox
                message="There are no lists in this cohort!"
                type={MessageType.INFO}
              />
            ) : (
              <ul className="cohort-list">
                {_map(lists, list => (
                  <li className="cohort-list__item" key={list._id}>
                    <Link to={`/list/${list._id}`} replace>
                      <CardItem name={list.name} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

Cohort.propTypes = {
  cohortDetails: PropTypes.objectOf(PropTypes.string),
  lists: PropTypes.objectOf(PropTypes.object),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,

  fetchCohortDetails: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  cohortDetails: getCohortDetails(state, ownProps.match.params.id),
  lists: getListsForGivenCohort(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { fetchCohortDetails }
  )(Cohort)
);
