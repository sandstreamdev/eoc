import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import {
  lockCohortHeader,
  unlockCohortHeader,
  updateCohort
} from '../model/actions';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import DescriptionTextarea from 'common/components/DescriptionTextarea';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { DefaultLocks, KeyCodes } from 'common/constants/enums';
import { getCurrentUser } from 'modules/user/model/selectors';
import CohortName from './CohortName';
import './CohortHeader.scss';

class CohortHeader extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      descriptionInputValue: trimmedDescription,
      errorMessageId: '',
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      pendingForDescription: false
    };
  }

  componentDidUpdate(prevProps) {
    const {
      details: { description }
    } = this.props;
    const {
      details: { description: previousDescription }
    } = prevProps;

    if (description !== previousDescription) {
      this.updateDescription();
    }
  }

  updateDescription = () => {
    const {
      details: { description }
    } = this.props;

    this.setState({
      descriptionInputValue: description
    });
  };

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

  showDescriptionTextarea = () =>
    this.setState({
      isDescriptionTextareaVisible: true
    });

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
      details: {
        description,
        isOwner,
        locks: { description: descriptionLock } = DefaultLocks
      }
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

  render() {
    const { pendingForDescription } = this.state;
    const { details, updateBreadcrumbs } = this.props;

    return (
      <header className="cohort-header">
        <CohortName details={details} onNameChange={updateBreadcrumbs} />
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
  match: RouterMatchPropType.isRequired,

  updateBreadcrumbs: PropTypes.func.isRequired,
  updateCohort: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  withRouter,
  connect(
    mapStateToProps,
    {
      updateCohort
    }
  )
)(CohortHeader);
