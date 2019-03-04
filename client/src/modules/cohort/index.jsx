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
import { fetchListMetaData } from 'modules/shopping-list/model/actions';
import { CohortIcon, EditIcon } from 'assets/images/icons';
import { getCohortDetails } from './model/selectors';
import { MessageType } from 'common/constants/enums';
import { RouterMatchPropType } from 'common/constants/propTypes';
import ModalForm from 'common/components/ModalForm';
import { updateCohort } from './model/actions';

class Cohort extends PureComponent {
  state = {
    updateFormVisibility: false
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

  showUpdateForm = () => {
    this.setState({ updateFormVisibility: true });
  };

  hideUpdateForm = () => {
    this.setState({ updateFormVisibility: false });
  };

  updateCohortHandler = cohortId => (name, description) => {
    const { cohortDetails, updateCohort } = this.props;
    const {
      description: previousDescription,
      name: previousName
    } = cohortDetails;
    const dataToUpdate = {};

    if (
      previousDescription !== dataToUpdate.description ||
      previousName !== dataToUpdate.name
    ) {
      name && (dataToUpdate.name = name);
      description && (dataToUpdate.description = description);

      updateCohort(cohortId, dataToUpdate);
    }
    this.hideUpdateForm();
  };

  render() {
    const {
      cohortDetails,
      lists,
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    if (!cohortDetails) {
      return null;
    }

    const { name, description } = cohortDetails;
    const { updateFormVisibility } = this.state;
    return (
      <Fragment>
        <Toolbar>
          <ToolbarItem mainIcon={<EditIcon />} onClick={this.showUpdateForm} />
        </Toolbar>
        {updateFormVisibility && (
          <ModalForm
            defaultDescription={description}
            defaultName={name}
            label="Edit cohort"
            onCancel={this.hideUpdateForm}
            onSubmit={this.updateCohortHandler(cohortId)}
          />
        )}
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
  lists: PropTypes.objectOf(PropTypes.object),
  match: RouterMatchPropType.isRequired,

  fetchListMetaData: PropTypes.func.isRequired,
  updateCohort: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  cohortDetails: getCohortDetails(state, ownProps.match.params.id),
  lists: getLists(state, ownProps.match.params.id)
});

export default withRouter(
  connect(
    mapStateToProps,
    { fetchListMetaData, updateCohort }
  )(Cohort)
);
