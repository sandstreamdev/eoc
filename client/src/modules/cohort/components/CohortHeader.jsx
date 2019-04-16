import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';

import { CohortIcon } from 'assets/images/icons';
import { updateCohort } from '../model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import NameInput from 'common/components/NameInput';
import DescriptionTextarea from 'common/components/DescriptionTextarea';
import Preloader, { PreloaderSize } from 'common/components/Preloader';

class CohortHeader extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description, name }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      description: trimmedDescription,
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      name,
      pendingForDescription: false,
      pendingForName: false
    };
  }

  handleClick = (event, isClickedOutside) => {
    const {
      isDescriptionTextareaVisible,
      isNameInputVisible,
      name
    } = this.state;

    if (isDescriptionTextareaVisible && isClickedOutside) {
      this.setState({ isDescriptionTextareaVisible: false });
      this.handleDescriptionUpdate();
      return;
    }

    if (isNameInputVisible && name.trim().length >= 1 && isClickedOutside) {
      this.setState({ isNameInputVisible: false });
      this.handleNameUpdate();
    }
  };

  handleKeyPress = event => {
    const { isDescriptionTextareaVisible } = this.state;
    const { code } = event;

    if (code === 'Enter' || code === 'Escape') {
      const action = isDescriptionTextareaVisible
        ? this.handleDescriptionUpdate
        : this.handleNameUpdate;

      action();
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

  handleNameUpdate = () => {
    const {
      updateCohort,
      details,
      match: {
        params: { id }
      }
    } = this.props;
    const { name } = this.state;
    const nameToUpdate = name.trim();
    const { name: previousName } = details;

    if (previousName === name) {
      this.setState({ isNameInputVisible: false });
      return;
    }

    if (nameToUpdate.length >= 1) {
      this.setState({ pendingForName: true });

      updateCohort(id, { name }).finally(() =>
        this.setState({
          isNameInputVisible: false,
          pendingForName: false
        })
      );
    }
  };

  handleDescriptionUpdate = () => {
    const {
      updateCohort,
      details,
      match: {
        params: { id }
      }
    } = this.props;
    const { description } = this.state;
    const { description: previousDescription } = details;

    if (previousDescription.trim() === description.trim()) {
      this.setState({
        description: description.trim(),
        isDescriptionTextareaVisible: false
      });
      return;
    }

    const updatedDescription = _isEmpty(_trim(description)) ? '' : description;

    this.setState({
      isDescriptionTextareaVisible: false,
      pendingForDescription: true
    });

    updateCohort(id, { description: updatedDescription })
      .then(() =>
        this.setState({
          description: updatedDescription,
          pendingForDescription: false
        })
      )
      .catch(() => this.setState({ pendingForDescription: false }));
  };

  renderDescription = () => {
    const {
      description,
      isDescriptionTextareaVisible,
      pendingForDescription
    } = this.state;

    if (pendingForDescription) return <Preloader size={PreloaderSize.SMALL} />;

    return (
      <Fragment>
        {isDescriptionTextareaVisible ? (
          <DescriptionTextarea
            description={description}
            onClick={this.handleClick}
            onDescriptionChange={this.handleDescriptionChange}
            onKeyPress={this.handleKeyPress}
          />
        ) : (
          <Fragment>
            {description ? (
              <p
                className="cohort-header__description"
                data-id="description"
                onClick={this.handleDescriptionTextareaVisibility}
              >
                {description}
              </p>
            ) : (
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
      </Fragment>
    );
  };

  renderName = () => {
    const { name, isNameInputVisible, pendingForName } = this.state;

    if (pendingForName) return <Preloader size={PreloaderSize.SMALL} />;

    return (
      <Fragment>
        {isNameInputVisible ? (
          <NameInput
            name={name}
            onClick={this.handleClick}
            onKeyPress={this.handleKeyPress}
            onNameChange={this.handleNameChange}
          />
        ) : (
          <h1
            className="cohort-header__heading"
            onClick={this.handleNameInputVisibility}
          >
            {name}
          </h1>
        )}
      </Fragment>
    );
  };

  render() {
    return (
      <header className="cohort-header">
        <div className="cohort-header__top">
          <CohortIcon />
          {this.renderName()}
        </div>
        <div className="cohort-header__bottom">{this.renderDescription()}</div>
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
