import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import classNames from 'classnames';

import { CohortIcon } from 'assets/images/icons';
import { updateCohort } from '../model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import NameInput from 'common/components/NameInput';
import DescriptionTextarea from 'common/components/DescriptionTextarea';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { PENDING_DELAY } from 'common/constants/variables';

class CohortHeader extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description, name }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      descriptionInput: trimmedDescription,
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      nameInput: name,
      pendingForDescription: false,
      pendingForName: false
    };
  }

  handleClick = (event, isClickedOutside) => {
    const {
      isDescriptionTextareaVisible,
      isNameInputVisible,
      nameInput
    } = this.state;

    if (isDescriptionTextareaVisible && isClickedOutside) {
      this.handleDescriptionUpdate();
      return;
    }

    if (
      isNameInputVisible &&
      nameInput.trim().length >= 1 &&
      isClickedOutside
    ) {
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

    this.setState({ nameInput: value });
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ descriptionInput: value });
  };

  handleNameUpdate = () => {
    const {
      updateCohort,
      details,
      match: {
        params: { id }
      }
    } = this.props;
    const { nameInput } = this.state;
    const nameToUpdate = nameInput.trim();
    const { name: previousName } = details;

    if (previousName === nameToUpdate) {
      this.setState({ isNameInputVisible: false });
      return;
    }

    if (nameToUpdate.length >= 1) {
      const delayedPending = setTimeout(
        () => this.setState({ pendingForName: true }),
        PENDING_DELAY
      );

      updateCohort(id, { name: nameToUpdate }).finally(() => {
        clearTimeout(delayedPending);
        this.setState({
          isNameInputVisible: false,
          nameInput: nameToUpdate,
          pendingForName: false
        });
      });
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
    const { descriptionInput } = this.state;
    const { description: previousDescription } = details;

    if (previousDescription.trim() === descriptionInput.trim()) {
      this.setState({ isDescriptionTextareaVisible: false });
      return;
    }

    const updatedDescription = _isEmpty(_trim(descriptionInput))
      ? ''
      : _trim(descriptionInput);

    const delayedPending = setTimeout(
      () => this.setState({ pendingForDescription: true }),
      PENDING_DELAY
    );

    updateCohort(id, { description: updatedDescription }).finally(() => {
      clearTimeout(delayedPending);
      this.setState({
        isDescriptionTextareaVisible: false,
        descriptionInput: updatedDescription,
        pendingForDescription: false
      });
    });
  };

  renderDescription = () => {
    const {
      descriptionInput,
      isDescriptionTextareaVisible,
      pendingForDescription
    } = this.state;

    const {
      details: { description, isOwner }
    } = this.props;

    if (!description && !isOwner) {
      return;
    }

    if (pendingForDescription) {
      return (
        <div className="cohort-header__bottom">
          <Preloader size={PreloaderSize.SMALL} />
        </div>
      );
    }

    return isDescriptionTextareaVisible ? (
      <DescriptionTextarea
        description={descriptionInput}
        onClick={this.handleClick}
        onDescriptionChange={this.handleDescriptionChange}
        onKeyPress={this.handleKeyPress}
      />
    ) : (
      <Fragment>
        {description && (
          <p
            className={classNames('cohort-header__description', {
              'cohort-header--clickable': isOwner
            })}
            data-id="description"
            onClick={isOwner && this.handleDescriptionTextareaVisibility}
          >
            {description}
          </p>
        )}
        {isOwner && !description && (
          <button
            className="cohort-header__button link-button"
            onClick={this.handleDescriptionTextareaVisibility}
            type="button"
          >
            Add description
          </button>
        )}
      </Fragment>
    );
  };

  renderName = () => {
    const { isNameInputVisible, nameInput, pendingForName } = this.state;
    const {
      details: { isOwner, name }
    } = this.props;

    if (pendingForName) {
      return <Preloader size={PreloaderSize.SMALL} />;
    }

    return isNameInputVisible ? (
      <NameInput
        name={nameInput}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyPress}
        onNameChange={this.handleNameChange}
      />
    ) : (
      <h1
        className={classNames('cohort-header__heading', {
          'cohort-header--clickable': isOwner
        })}
        onClick={isOwner && this.handleNameInputVisibility}
      >
        {name}
      </h1>
    );
  };

  render() {
    return (
      <header className="cohort-header">
        <div className="cohort-header__top">
          <CohortIcon />
          {this.renderName()}
        </div>
        {this.renderDescription()}
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
