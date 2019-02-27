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
import CreationForm from 'common/components/CreationForm';
import PlusIcon from 'assets/images/plus-solid.svg';

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

  hideForm = () => {
    this.setState({ listFormVisibility: false });
  };

  showForm = () => {
    this.setState({ listFormVisibility: true });
  };

  handleListSubmission = (name, description) => {
    const {
      createList,
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;
    createList(name, description, userId, cohortId);
    this.hideForm();
  };

  renderCreateListForm = () => {
    const { listFormVisibility } = this.state;
    return (
      listFormVisibility && (
        <div className="cohort__form">
          <CreationForm
            label="Create new list"
            onSubmit={this.handleListSubmission}
            type="menu"
            onHide={this.hideForm}
          />
        </div>
      )
    );
  };

  render() {
    const { cohortDetails, lists } = this.props;

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
            onClick={this.showForm}
          >
            {this.renderCreateListForm()}
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
