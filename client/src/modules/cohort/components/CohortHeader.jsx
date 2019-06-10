import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { CohortIcon } from 'assets/images/icons';
import { updateCohort } from '../model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import NameInput from 'common/components/NameInput';
import DescriptionTextarea from 'common/components/DescriptionTextarea';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { KeyCodes } from 'common/constants/enums';

class CohortHeader extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description, name }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      descriptionInputValue: trimmedDescription,
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      nameInputValue: name,
      pendingForDescription: false,
      pendingForName: false
    };
  }

  handleClick = (event, isClickedOutside) => {
    const {
      isDescriptionTextareaVisible,
      isNameInputVisible,
      nameInputValue
    } = this.state;

    if (isDescriptionTextareaVisible && isClickedOutside) {
      this.handleDescriptionUpdate();
      return;
    }

    if (
      isNameInputVisible &&
      nameInputValue.trim().length >= 1 &&
      isClickedOutside
    ) {
      this.handleNameUpdate();
    }
  };

  handleKeyPress = event => {
    const { isDescriptionTextareaVisible } = this.state;
    const { code } = event;

    if (code === KeyCodes.ENTER || code === KeyCodes.ESCAPE) {
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

    this.setState({ nameInputValue: value });
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ descriptionInputValue: value });
  };

  handleNameUpdate = () => {
    const {
      details,
      match: {
        params: { id }
      },
      updateBreadcrumbs,
      updateCohort
    } = this.props;
    const { nameInputValue } = this.state;
    const nameToUpdate = _trim(nameInputValue);
    const { name: previousName } = details;

    if (_trim(previousName) === nameToUpdate) {
      this.setState({ isNameInputVisible: false });
      return;
    }

    if (nameToUpdate.length >= 1) {
      this.setState({ pendingForName: true });

      updateCohort(previousName, id, { name: nameToUpdate }).finally(() => {
        this.setState({
          isNameInputVisible: false,
          nameInputValue: nameToUpdate,
          pendingForName: false
        });

        updateBreadcrumbs();
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
    const { descriptionInputValue } = this.state;
    const descriptionToUpdate = _trim(descriptionInputValue);
    const { description: previousDescription, name: previousName } = details;

    if (_trim(previousDescription) === descriptionToUpdate) {
      this.setState({ isDescriptionTextareaVisible: false });
      return;
    }

    const updatedDescription = _isEmpty(descriptionToUpdate)
      ? ''
      : descriptionToUpdate;

    this.setState({ pendingForDescription: true });

    updateCohort(previousName, id, { description: updatedDescription }).finally(
      () =>
        this.setState({
          isDescriptionTextareaVisible: false,
          descriptionInputValue: updatedDescription,
          pendingForDescription: false
        })
    );
  };

  renderDescription = () => {
    const {
      descriptionInputValue,
      isDescriptionTextareaVisible,
      pendingForDescription
    } = this.state;

    const {
      details: { description, isOwner }
    } = this.props;

    if (!description && !isOwner) {
      return;
    }

    return isDescriptionTextareaVisible ? (
      <DescriptionTextarea
        description={descriptionInputValue}
        disabled={pendingForDescription}
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
            onClick={isOwner ? this.handleDescriptionTextareaVisibility : null}
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
            <FormattedMessage id="cohort.cohort-header.add-description" />
          </button>
        )}
      </Fragment>
    );
  };

  renderName = () => {
    const { isNameInputVisible, nameInputValue, pendingForName } = this.state;
    const {
      details: { isOwner, name }
    } = this.props;

    return isNameInputVisible ? (
      <NameInput
        disabled={pendingForName}
        name={nameInputValue}
        onClick={this.handleClick}
        onKeyPress={this.handleKeyPress}
        onNameChange={this.handleNameChange}
      />
    ) : (
      <h1
        className={classNames('cohort-header__heading', {
          'cohort-header--clickable': isOwner
        })}
        onClick={isOwner ? this.handleNameInputVisibility : null}
      >
        {name}
      </h1>
    );
  };

  render() {
    const { pendingForDescription, pendingForName } = this.state;

    return (
      <header className="cohort-header">
        <div className="cohort-header__top">
          <CohortIcon />
          {this.renderName()}
          {pendingForName && <Preloader size={PreloaderSize.SMALL} />}
        </div>
        <div className="list-header__bottom">
          {this.renderDescription()}
          {pendingForDescription && <Preloader size={PreloaderSize.SMALL} />}
        </div>
      </header>
    );
  }
}

CohortHeader.propTypes = {
  details: PropTypes.objectOf(PropTypes.any).isRequired,
  match: RouterMatchPropType.isRequired,

  updateBreadcrumbs: PropTypes.func.isRequired,
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
