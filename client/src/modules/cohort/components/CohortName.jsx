import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import validator from 'validator';
import _trim from 'lodash/trim';
import { pipe } from '@sandstreamdev/std/function';
import { injectIntl } from 'react-intl';

import { CohortIcon } from 'assets/images/icons';
import NameInput from 'common/components/NameInput';
import { DefaultLocks, KeyCodes } from 'common/constants/enums';
import ErrorMessage from 'common/components/Forms/ErrorMessage';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import {
  RouterMatchPropType,
  IntlPropType,
  UserPropType
} from 'common/constants/propTypes';
import { validateWith } from 'common/utils/helpers';
import { getCurrentUser } from 'modules/user/model/selectors';
import {
  lockCohortHeader,
  unlockCohortHeader,
  updateCohort
} from '../model/actions';
import './CohortName.scss';

class CohortName extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { name }
    } = this.props;

    this.state = {
      errorMessageId: '',
      isNameInputVisible: false,
      nameInputValue: name,
      pendingForName: false
    };
  }

  componentDidUpdate(previousProps) {
    const {
      details: { name }
    } = this.props;
    const {
      details: { name: previousName }
    } = previousProps;
    const hasNameBeenChanged = name !== previousName;

    if (hasNameBeenChanged) {
      this.updateName();
    }
  }

  updateName = () => {
    const {
      details: { name }
    } = this.props;

    this.setState({
      nameInputValue: name
    });
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

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ nameInputValue: value }, this.validateName);
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
      onNameChange,
      updateCohort
    } = this.props;
    const { errorMessageId, nameInputValue } = this.state;
    const nameToUpdate = _trim(nameInputValue);
    const { name: previousName } = details;

    if (!errorMessageId && _trim(previousName) === nameToUpdate) {
      this.setState({ isNameInputVisible: false });

      return;
    }

    if (!errorMessageId && nameToUpdate.length >= 1) {
      this.setState({ pendingForName: true });
      this.handleNameLock();

      updateCohort(previousName, id, { name: nameToUpdate }).finally(() => {
        this.setState({
          isNameInputVisible: false,
          nameInputValue: nameToUpdate,
          pendingForName: false
        });

        this.handleNameUnmount();
        onNameChange();
      });
    }
  };

  handleClick = (event, isClickedOutside) => {
    const { errorMessageId, isNameInputVisible } = this.state;

    if (isNameInputVisible && isClickedOutside && !errorMessageId) {
      this.handleNameUpdate();
    }
  };

  handleKeyPress = event => {
    const { errorMessageId, isNameInputVisible } = this.state;
    const { code } = event;

    if (code === KeyCodes.ESCAPE) {
      if (isNameInputVisible && !errorMessageId) {
        this.handleNameUpdate();
      }
    }

    if (code === KeyCodes.ENTER && !errorMessageId) {
      this.handleNameUpdate();
    }
  };

  render() {
    const {
      errorMessageId,
      isNameInputVisible,
      nameInputValue,
      pendingForName
    } = this.state;
    const {
      details: { isOwner, locks: { name: nameLock } = DefaultLocks, name },
      intl: { formatMessage }
    } = this.props;

    return (
      <div
        className={classNames('cohort-name__top', {
          'cohort-name__top--disabled': nameLock
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
            className={classNames('cohort-name__heading', {
              'cohort-name--clickable': !nameLock && isOwner,
              'cohort-name__heading--disabled': nameLock
            })}
            onClick={isOwner && !nameLock ? this.showNameInput : null}
          >
            {name}
          </h1>
        )}
        {pendingForName && <Preloader size={PreloaderSize.SMALL} />}
      </div>
    );
  }
}

CohortName.propTypes = {
  currentUser: UserPropType.isRequired,
  details: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: IntlPropType.isRequired,
  match: RouterMatchPropType.isRequired,

  onNameChange: PropTypes.func.isRequired,
  updateCohort: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default pipe(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    {
      updateCohort
    }
  )
)(CohortName);
