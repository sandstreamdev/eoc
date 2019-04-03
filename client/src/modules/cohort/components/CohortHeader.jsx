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

    this.descriptionTextarea = React.createRef();
    this.nameInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handleEnterPress);
    document.addEventListener('click', this.handleClick);
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handleEnterPress);
    document.removeEventListener('click', this.handleClick);
  }

  handleClick = event => {
    const { isDescriptionFormVisible, isNameFormVisible } = this.state;

    if (isDescriptionFormVisible) {
      if (
        this.descriptionTextarea &&
        !this.descriptionTextarea.current.contains(event.target)
      ) {
        this.setState({
          isDescriptionFormVisible: false
        });
      }
    }

    if (isNameFormVisible) {
      if (this.nameInput && !this.nameInput.current.contains(event.target)) {
        this.setState({
          isNameFormVisible: false
        });
      }
    }
  };

  handleEnterPress = event => {
    const { isDescriptionFormVisible } = this.state;
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const { code } = event;

    if (code === 'Enter') {
      const action = isDescriptionFormVisible
        ? this.handleDescriptionUpdate
        : this.handleNameUpdate;

      action(id)();
    }
  };

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

  handleNameUpdate = cohortId => () => {
    const { updateCohort } = this.props;
    const { name } = this.state;

    updateCohort(cohortId, { name });
    this.setState({ isNameFormVisible: false });
  };

  handleDescriptionUpdate = cohortId => () => {
    const { updateCohort } = this.props;
    const { description } = this.state;

    updateCohort(cohortId, { description });
    this.setState({ isDescriptionFormVisible: false });
  };

  render() {
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
            <input
              className="cohort-header__name-input primary-input"
              onChange={this.handleNameChange}
              ref={this.nameInput}
              type="text"
              value={name}
            />
          ) : (
            <Fragment>{name}</Fragment>
          )}
        </h1>
        {isDescriptionFormVisible ? (
          <textarea
            className="cohort-header__desc-input primary-textarea"
            onChange={this.handleDescriptionChange}
            ref={this.descriptionTextarea}
            type="text"
            value={description}
          />
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
