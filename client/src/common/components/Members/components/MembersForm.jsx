import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import isEmail from 'validator/lib/isEmail';

import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import { KeyCodes } from 'common/constants/enums';
import { IntlPropType } from 'common/constants/propTypes';
import { CloseIcon } from 'assets/images/icons';
import './MembersForm.scss';
import { validateWith } from 'common/utils/helpers';

class MembersForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      inputValue: '',
      isFocused: false
    };

    this.input = React.createRef();
    this.form = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEnterPress);
    document.addEventListener('click', this.handleClickOutside);
    this.input.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEnterPress);
    document.removeEventListener('click', this.handleClickOutside);
  }

  handleInputChange = event => {
    const {
      target: { value }
    } = event;
    this.setState({ inputValue: value });
  };

  handleEnterPress = event => {
    const { code } = event;
    const { isFocused } = this.state;

    if (code === KeyCodes.ENTER && isFocused) {
      this.validateEmail();
    }
  };

  validateEmail = () => {
    const { inputValue } = this.state;
    const error = validateWith(isEmail)('user.auth.input.email.invalid')(
      inputValue
    );

    if (!error.length) {
      this.handleAddNew();
      this.setState({ error: false });

      return;
    }

    this.setState({ error });
  };

  handleAddNew = () => {
    const { onAddNew } = this.props;
    const { inputValue } = this.state;

    onAddNew(inputValue);
  };

  handleSubmit = event => event.preventDefault();

  handleFocus = () => this.setState({ isFocused: true });

  handleBlur = () => this.setState({ isFocused: false });

  handleClickOutside = event => {
    const isClickedOutside = !this.form.current.contains(event.target);
    const { onClickOutside } = this.props;

    if (isClickedOutside) {
      onClickOutside();
    }
  };

  resetInput = () => this.setState({ inputValue: '' });

  render() {
    const { error, inputValue } = this.state;
    const {
      disabled,
      intl: { formatMessage },
      pending
    } = this.props;
    const isEmpty = _isEmpty(_trim(inputValue));
    const isButtonDisabled = disabled || pending || isEmpty;
    const isClearButtonVisible = inputValue.length > 0;

    return (
      <Fragment>
        <form
          className={classNames('members-form', {
            'members-form--error': error
          })}
          onSubmit={this.handleSubmit}
          ref={this.form}
        >
          <label className="members-form__label">
            <input
              className={classNames('members-form__input primary-input', {
                'members-form__input--disabled': disabled,
                'members-form__input--error': error
              })}
              disabled={disabled || pending}
              onBlur={this.handleBlur}
              onChange={this.handleInputChange}
              onFocus={this.handleFocus}
              placeholder="Enter email"
              ref={this.input}
              type={formatMessage({ id: 'common.members-form.email' })}
              value={inputValue}
            />
            <button
              className={classNames('members-form__clear-button', {
                'members-form__clear-button--hide': !isClearButtonVisible
              })}
              onClick={this.resetInput}
              title={formatMessage({ id: 'common.button.reset-input' })}
              type="button"
            >
              <CloseIcon />
            </button>
          </label>
          <button
            className={classNames('primary-button', {
              'primary-button--disabled': disabled
            })}
            disabled={isButtonDisabled}
            onClick={this.validateEmail}
            type="button"
          >
            <FormattedMessage id="common.members-form.add" />
            {pending && (
              <Preloader
                size={PreloaderSize.SMALL}
                theme={PreloaderTheme.LIGHT}
              />
            )}
          </button>
        </form>
        {error && (
          <div className="error-message">
            <FormattedMessage id={error} />
          </div>
        )}
      </Fragment>
    );
  }
}

MembersForm.propTypes = {
  disabled: PropTypes.bool,
  intl: IntlPropType.isRequired,
  pending: PropTypes.bool.isRequired,

  onAddNew: PropTypes.func.isRequired,
  onClickOutside: PropTypes.func.isRequired
};

export default injectIntl(MembersForm);
