import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';
import validator from 'validator';

import { CohortIcon } from 'assets/images/icons';
import {
  lockCohortHeader,
  unlockCohortHeader,
  updateCohort
} from '../model/actions';
import {
  RouterMatchPropType,
  IntlPropType,
  UserPropType
} from 'common/constants/propTypes';
import NameInput from 'common/components/NameInput';
import DescriptionTextarea from 'common/components/DescriptionTextarea';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { KeyCodes } from 'common/constants/enums';
import { getCurrentUser } from 'modules/user/model/selectors';
import { validateWith } from 'common/utils/helpers';
import ErrorMessage from 'common/components/Forms/ErrorMessage';

class CohortHeader extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description, name }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      descriptionInputValue: trimmedDescription,
      errorMessageId: '',
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      nameInputValue: name,
      pendingForDescription: false,
      pendingForName: false
    };
  }

  handleClick = (event, isClickedOutside) => {
    const {
      errorMessageId,
      isDescriptionTextareaVisible,
      isNameInputVisible
    } = this.state;

    if (isDescriptionTextareaVisible && isClickedOutside) {
      this.handleDescriptionUpdate();

      return;
    }

    if (isNameInputVisible && isClickedOutside && !errorMessageId) {
      this.handleNameUpdate();
    }
  };

  handleKeyPress = event => {
    const {
      errorMessageId,
      isDescriptionTextareaVisible,
      isNameInputVisible
    } = this.state;
    const { code } = event;

    if (code === KeyCodes.ESCAPE) {
      if (isDescriptionTextareaVisible) {
        this.handleDescriptionUpdate();
      }

      if (isNameInputVisible && !errorMessageId) {
        this.handleNameUpdate();
      }
    }

    if (code === KeyCodes.ENTER && !errorMessageId) {
      this.handleNameUpdate();
    }
  };

  validateName = () => {
    const { nameInputValue } = this.state;
    let errorMessageId;

    errorMessageId = validateWith(
      value => !validator.isEmpty(value, { ignore_whitespace: true })
    )('common.form.required-warning')(nameInputValue);

    if (_trim(nameInputValue)) {
      errorMessageId = validateWith(value =>
        validator.isLength(value, { min: 1, max: 32 })
      )('common.form.field-min-max')(nameInputValue);
    }

    this.setState({ errorMessageId });
  };

  showNameInput = () =>
    this.setState({
      isNameInputVisible: true
    });

  showDescriptionTextarea = () =>
    this.setState({
      isDescriptionTextareaVisible: true
    });

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ nameInputValue: value }, this.validateName);
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ descriptionInputValue: value });
  };

  handleDescriptionLock = () => {
    const {
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    lockCohortHeader(cohortId, userId, { descriptionLock: true });
  };

  handleDescriptionUnmount = () => {
    const {
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    unlockCohortHeader(cohortId, userId, { descriptionLock: false });
  };

  handleNameLock = () => {
    const {
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    lockCohortHeader(cohortId, userId, { nameLock: true });
  };

  handleNameUnmount = () => {
    const {
      currentUser: { id: userId },
      match: {
        params: { id: cohortId }
      }
    } = this.props;

    unlockCohortHeader(cohortId, userId, { nameLock: false });
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
    const { errorMessageId, nameInputValue } = this.state;
    const nameToUpdate = _trim(nameInputValue);
    const { name: previousName } = details;

    if (!errorMessageId) {
      if (_trim(previousName) === nameToUpdate) {
        this.setState({ isNameInputVisible: false });

        return;
      }

      if (nameToUpdate.length >= 1) {
        this.setState({ pendingForName: true });
        this.handleNameLock();

        updateCohort(previousName, id, { name: nameToUpdate }).finally(() => {
          this.setState({
            isNameInputVisible: false,
            nameInputValue: nameToUpdate,
            pendingForName: false
          });

          this.handleNameUnmount();
          updateBreadcrumbs();
        });
      }
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
    this.handleDescriptionLock();

    updateCohort(previousName, id, { description: updatedDescription }).finally(
      () => {
        this.setState({
          isDescriptionTextareaVisible: false,
          descriptionInputValue: updatedDescription,
          pendingForDescription: false
        });
        this.handleDescriptionUnmount();
      }
    );
  };

  renderDescription = () => {
    const {
      descriptionInputValue,
      isDescriptionTextareaVisible,
      pendingForDescription
    } = this.state;

    const {
      details: { description, descriptionLock, isOwner }
    } = this.props;

    if (!description && !isOwner) {
      return;
    }

    return isDescriptionTextareaVisible ? (
      <DescriptionTextarea
        description={descriptionInputValue}
        disabled={pendingForDescription || descriptionLock}
        onClick={this.handleClick}
        onDescriptionChange={this.handleDescriptionChange}
        onFocus={this.handleDescriptionLock}
        onKeyPress={this.handleKeyPress}
        onUnmount={this.handleDescriptionUnmount}
      />
    ) : (
      <Fragment>
        {description && (
          <p
            className={classNames('cohort-header__description', {
              'cohort-header--clickable': !descriptionLock && isOwner,
              'cohort-header__description--disabled': descriptionLock
            })}
            data-id="description"
            onClick={
              isOwner && !descriptionLock ? this.showDescriptionTextarea : null
            }
          >
            {description}
          </p>
        )}
        {isOwner && !description && (
          <button
            className="cohort-header__button link-button"
            disabled={descriptionLock}
            onClick={this.showDescriptionTextarea}
            type="button"
          >
            <FormattedMessage id="cohort.cohort-header.add-description" />
          </button>
        )}
      </Fragment>
    );
  };

  renderName = () => {
    const {
      errorMessageId,
      isNameInputVisible,
      nameInputValue,
      pendingForName
    } = this.state;
    const {
      details: { isOwner, name, nameLock },
      intl: { formatMessage }
    } = this.props;

    return (
      <div
        className={classNames('cohort-header__top', {
          'cohort-header__top--disabled': nameLock
        })}
      >
        <CohortIcon />
        {isNameInputVisible && !nameLock ? (
          <div>
            <NameInput
              disabled={pendingForName || nameLock}
              name={nameInputValue}
              onClick={this.handleClick}
              onFocus={this.handleNameLock}
              onKeyPress={this.handleKeyPress}
              onNameChange={this.handleNameChange}
              onUnmount={this.handleNameUnmount}
            />
            {errorMessageId && (
              <ErrorMessage message={formatMessage({ id: errorMessageId })} />
            )}
          </div>
        ) : (
          <h1
            className={classNames('cohort-header__heading', {
              'cohort-header--clickable': !nameLock && isOwner,
              'cohort-header__heading--disabled': nameLock
            })}
            onClick={isOwner && !nameLock ? this.showNameInput : null}
          >
            {name}
          </h1>
        )}
        {pendingForName && <Preloader size={PreloaderSize.SMALL} />}
      </div>
    );
  };

  render() {
    const { pendingForDescription } = this.state;

    return (
      <header className="cohort-header">
        {this.renderName()}
        <div className="list-header__bottom">
          {this.renderDescription()}
          {pendingForDescription && <Preloader size={PreloaderSize.SMALL} />}
        </div>
      </header>
    );
  }
}

CohortHeader.propTypes = {
  currentUser: UserPropType.isRequired,
  details: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: IntlPropType.isRequired,
  match: RouterMatchPropType.isRequired,

  updateBreadcrumbs: PropTypes.func.isRequired,
  updateCohort: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    {
      updateCohort
    }
  )
)(CohortHeader);
