import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { CohortIcon } from 'assets/images/icons';
import { updateCohort } from '../model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import { whiteSpaceOnly } from 'common/utils/helpers';

class CohortHeader extends PureComponent {
  constructor(props) {
    super(props);

    const { details } = this.props;
    const { name, description } = details;

    this.state = {
      description,
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      name
    };

    this.descriptionTextarea = React.createRef();
    this.nameInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('mousedown', this.handleClick);
  }

  componentDidUpdate() {
    this.descriptionTextarea.current &&
      this.descriptionTextarea.current.focus();
    this.nameInput.current && this.nameInput.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('mousedown', this.handleClick);
  }

  handleClick = event => {
    const {
      isDescriptionTextareaVisible,
      isNameInputVisible,
      name
    } = this.state;
    const {
      match: {
        params: { id }
      }
    } = this.props;

    if (
      isDescriptionTextareaVisible &&
      !this.descriptionTextarea.current.contains(event.target)
    ) {
      this.setState({ isDescriptionTextareaVisible: false });
      this.handleDescriptionUpdate(id)();
      return;
    }

    if (
      isNameInputVisible &&
      name.length >= 1 &&
      !this.nameInput.current.contains(event.target)
    ) {
      this.setState({ isNameInputVisible: false });
      this.handleNameUpdate(id)();
    }
  };

  handleKeyPress = event => {
    const { isDescriptionTextareaVisible } = this.state;
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const { code } = event;

    if (code === 'Enter' || code === 'Escape') {
      const action = isDescriptionTextareaVisible
        ? this.handleDescriptionUpdate
        : this.handleNameUpdate;

      action(id)();
    }
  };

  handleNameInputVisibility = () =>
    this.setState(({ isNameInputVisible }) => ({
      isNameInputVisible: !isNameInputVisible
    }));

  handleDescriptionTextareaVisibility = () =>
    this.setState(({ isDescriptionTextareaVisible }) => ({
      isDescriptionTextareaVisible: !isDescriptionTextareaVisible
    }));

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
    const { updateCohort, details } = this.props;
    const { name } = this.state;
    const nameToUpdate = name.trim();
    const { name: previousName } = details;

    if (previousName === name) {
      this.setState({ isNameInputVisible: false });
      return;
    }

    if (nameToUpdate.length >= 1) {
      updateCohort(cohortId, { name });
      this.setState({ isNameInputVisible: false });
    }
  };

  handleDescriptionUpdate = cohortId => () => {
    const { updateCohort, details } = this.props;
    const { description } = this.state;
    const { description: previousDescription } = details;

    if (previousDescription.trim() === description.trim()) {
      this.setState({ isDescriptionTextareaVisible: false });
      return;
    }

    if (whiteSpaceOnly(description)) {
      updateCohort(cohortId, { description: '' });
      return;
    }

    updateCohort(cohortId, { description });
    this.setState({ isDescriptionTextareaVisible: false });
  };

  render() {
    const {
      description,
      isDescriptionTextareaVisible,
      isNameInputVisible,
      name
    } = this.state;

    return (
      <header className="cohort-header">
        <div className="cohort-header__top">
          <CohortIcon />
          {isNameInputVisible ? (
            <input
              className="cohort-header__name-input primary-input"
              name="name"
              onChange={this.handleNameChange}
              ref={this.nameInput}
              type="text"
              value={name}
            />
          ) : (
            <h1
              className="cohort-header__heading"
              onClick={this.handleNameInputVisibility}
            >
              {name}
            </h1>
          )}
        </div>
        {isDescriptionTextareaVisible ? (
          <textarea
            className="cohort-header__desc-textarea primary-textarea"
            name="description"
            onChange={this.handleDescriptionChange}
            ref={this.descriptionTextarea}
            type="text"
            value={description}
          />
        ) : (
          <Fragment>
            {description.trim() && (
              <p
                className="cohort-header__description"
                data-id="description"
                onClick={this.handleDescriptionTextareaVisibility}
              >
                {description}
              </p>
            )}
            {!description.trim() && (
              <button
                className="cohort-header__button link-button"
                onClick={this.handleDescriptionTextareaVisibility}
                type="button"
              >
                Add description
              </button>
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
