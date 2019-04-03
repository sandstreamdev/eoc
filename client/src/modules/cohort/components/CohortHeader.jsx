import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { CohortIcon } from 'assets/images/icons';
import { updateCohort } from '../model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';

class CohortHeader extends PureComponent {
  constructor(props) {
    super(props);

    const { details } = this.props;
    const { name, description } = details;

    this.state = {
      description,
      isDescriptionFormVisible: false,
      isNameFormVisible: false,
      name
    };
  }

  handleNameFormVisibility = () => {
    const { isNameFormVisible } = this.state;

    this.setState({ isNameFormVisible: !isNameFormVisible });
  };

  handleDescriptionFormVisibility = () => {
    const { isDescriptionFormVisible } = this.state;

    this.setState({ isDescriptionFormVisible: !isDescriptionFormVisible });
  };

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ name: value });
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ description: value });
  };

  handleNameUpdate = cohortId => event => {
    event.preventDefault();
    const { updateCohort } = this.props;
    const { name } = this.state;

    updateCohort(cohortId, { name });
    this.setState({ isNameFormVisible: false });
  };

  handleDescriptionUpdate = cohortId => event => {
    event.preventDefault();
    const { updateCohort } = this.props;
    const { description } = this.state;

    updateCohort(cohortId, { description });
    this.setState({ isDescriptionFormVisible: false });
  };

  render() {
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const {
      description,
      isDescriptionFormVisible,
      isNameFormVisible,
      name
    } = this.state;

    return (
      <header className="cohort-header">
        <h1
          className="cohort-header__heading"
          onDoubleClick={this.handleNameFormVisibility}
        >
          <CohortIcon />
          {isNameFormVisible ? (
            <form
              className="cohort-header__name-form"
              onSubmit={this.handleNameUpdate(id)}
            >
              <input
                className="cohort-header__name-input primary-input"
                onChange={this.handleNameChange}
                type="text"
                value={name}
              />
            </form>
          ) : (
            <Fragment>{name}</Fragment>
          )}
        </h1>
        {isDescriptionFormVisible ? (
          <form
            className="cohort-header__desc-form"
            onSubmit={this.handleDescriptionUpdate(id)}
          >
            <input
              className="cohort-header__desc-input primary-textarea"
              onChange={this.handleDescriptionChange}
              type="text"
              value={description}
            />
          </form>
        ) : (
          <Fragment>
            {description && (
              <p
                className="cohort-header__description"
                onDoubleClick={this.handleDescriptionFormVisibility}
              >
                {description}
              </p>
            )}
          </Fragment>
        )}
      </header>
    );
  }
}

CohortHeader.propTypes = {
  details: PropTypes.objectOf(PropTypes.any).isRequired,
  match: RouterMatchPropType.isRequired,

  updateCohort: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    {
      updateCohort
    }
  )(CohortHeader)
);
