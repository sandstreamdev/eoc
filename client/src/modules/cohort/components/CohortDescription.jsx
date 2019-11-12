import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import _trim from 'lodash/trim';
import _flowRight from 'lodash/flowRight';
import _isEmpty from 'lodash/isEmpty';

import DescriptionTextarea from 'common/components/DescriptionTextarea';
import { DefaultLocks, KeyCodes } from 'common/constants/enums';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { getCurrentUser } from 'modules/user/model/selectors';
import {
  lockCohortHeader,
  unlockCohortHeader,
  updateCohort
} from '../model/actions';
import './CohortDescription.scss';
import {
  attachBeforeUnloadEvent,
  removeBeforeUnloadEvent
} from 'common/utils/events';

class CohortDescription extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      descriptionInputValue: trimmedDescription,
      isDescriptionTextareaVisible: false,
      isDirty: false,
      pendingForDescription: false
    };
  }

  componentDidMount() {
    attachBeforeUnloadEvent(this.handleWindowBeforeUnload);
  }

  componentDidUpdate(previousProps) {
    const {
      details: { description }
    } = this.props;
    const {
      details: { description: previousDescription }
    } = previousProps;
    const { descriptionInputValue } = this.state;
    const dataHasChanged = previousDescription !== descriptionInputValue;

    if (description !== previousDescription) {
      this.updateDescription();
    }

    this.handleDataChange(dataHasChanged);
  }

  componentWillUnmount() {
    removeBeforeUnloadEvent(this.handleWindowBeforeUnload);
  }

  handleWindowBeforeUnload = event => {
    const { isDirty } = this.state;

    if (isDirty) {
      event.preventDefault();
      // Chrome requires returnValue to be set
      // eslint-disable-next-line no-param-reassign
      event.returnValue = '';
    }
  };

  handleDataChange = dataHasChanged =>
    this.setState({ isDirty: dataHasChanged });

  updateDescription = () => {
    const {
      details: { description }
    } = this.props;

    this.setState({
      descriptionInputValue: description
    });
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

  handleClick = (event, isClickedOutside) => {
    const { isDescriptionTextareaVisible } = this.state;

    if (isDescriptionTextareaVisible && isClickedOutside) {
      this.handleDescriptionUpdate();
    }
  };

  handleKeyPress = event => {
    const { isDescriptionTextareaVisible } = this.state;
    const { code } = event;

    if (code === KeyCodes.ESCAPE && isDescriptionTextareaVisible) {
      this.handleDescriptionUpdate();
    }
  };

  render() {
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

    return (
      <div className="cohort-description__bottom">
        {isDescriptionTextareaVisible ? (
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
          <>
            {description && (
              <p
                className={classNames('cohort-description__heading', {
                  'cohort-description--clickable': !descriptionLock && isOwner,
                  'cohort-description__heading--disabled': descriptionLock
                })}
                data-id="description"
                onClick={
                  isOwner && !descriptionLock
                    ? this.showDescriptionTextarea
                    : null
                }
              >
                {description}
              </p>
            )}
            {isOwner && !description && (
              <button
                className="cohort-description__button link-button"
                disabled={descriptionLock}
                onClick={this.showDescriptionTextarea}
                type="button"
              >
                <FormattedMessage id="cohort.cohort-header.add-description" />
              </button>
            )}
          </>
        )}
        {pendingForDescription && <Preloader size={PreloaderSize.SMALL} />}
      </div>
    );
  }
}

CohortDescription.propTypes = {
  currentUser: UserPropType.isRequired,
  details: PropTypes.objectOf(PropTypes.any).isRequired,
  match: RouterMatchPropType.isRequired,

  updateCohort: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
  connect(mapStateToProps, {
    updateCohort
  })
)(CohortDescription);
