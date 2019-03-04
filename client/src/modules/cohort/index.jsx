import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';

import CardItem from 'common/components/CardItem';
import MessageBox from 'common/components/MessageBox';
import Toolbar, { ToolbarItem } from 'common/components/Toolbar';
import { getLists } from 'modules/shopping-list/model/selectors';
import {
  createList,
  fetchListMetaData
} from 'modules/shopping-list/model/actions';
import { CohortIcon, ListIcon } from 'assets/images/icons';
import { getCohortDetails } from './model/selectors';
import { MessageType } from 'common/constants/enums';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { getCurrentUser } from 'modules/authorization/model/selectors';
import PlusIcon from 'assets/images/plus-solid.svg';
import { noOp } from 'common/utils/noOp';
import DropdownForm from 'common/components/DropdownForm';

class Cohort extends PureComponent {
  state = {
    listFormVisibility: false
  };

  componentDidMount() {
    const {
      fetchListMetaData,
      match: {
        params: { id }
      }
    } = this.props;

    fetchListMetaData(id);
  }

  hideListCreationForm = () => {
    this.setState({ listFormVisibility: false });
  };

  showListCreationForm = () => {
    this.setState({ listFormVisibility: true });
  };

  createListSubmissionHandler = (name, description) => {
    const {
      createList,
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;
    createList(name, description, userId, cohortId)
      .then(this.hideListCreationForm)
      .catch(noOp);
  };

  render() {
    const { cohortDetails, lists } = this.props;
    const { listFormVisibility } = this.state;

    if (!cohortDetails) {
      return null;
    }

    const { name, description } = cohortDetails;

    return (
      <Fragment>
        <Toolbar>
          <ToolbarItem
            additionalIconSrc={PlusIcon}
            mainIcon={<ListIcon />}
            onClick={this.showListCreationForm}
          >
            <DropdownForm
              isVisible={listFormVisibility}
              label="Create new list"
              onHide={this.hideListCreationForm}
              onSubmit={this.createListSubmissionHandler}
              type="menu"
            />
          </ToolbarItem>
        </Toolbar>
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
                    <Link to={`/list/${list._id}`}>
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
  cohortDetails: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string
  }),
  createList: PropTypes.func.isRequired,
  currentUser: UserPropType.isRequired,
  lists: PropTypes.objectOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,

  fetchListMetaData: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  cohortDetails: getCohortDetails(state, ownProps.match.params.id),
  currentUser: getCurrentUser(state),
  lists: getLists(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { createList, fetchListMetaData }
  )(Cohort)
);
