import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';

import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import { KeyCodes } from 'common/constants/enums';
import { IntlPropType } from 'common/constants/propTypes';
import './MembersForm.scss';

class MembersForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      inputValue: '',
      isFocused: false
    };

    this.input = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleEnterPress);
    this.input.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEnterPress);
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
      this.handleAddNew();
    }
  };

  handleAddNew = () => {
    const { onAddNew } = this.props;
    const { inputValue } = this.state;

    if (inputValue.trim()) {
      onAddNew(inputValue);
    }
  };

  handleSubmit = event => event.preventDefault();

  handleFocus = () => this.setState({ isFocused: true });

  handleBlur = () => this.setState({ isFocused: false });

  render() {
    const { inputValue } = this.state;
    const {
      disabled,
      intl: { formatMessage },
      pending
    } = this.props;
    const isEmpty = inputValue.trim() === '';
    const isButtonDisabled = disabled || pending || isEmpty;

    return (
      <form className="members-form" onSubmit={this.handleSubmit}>
        <input
          className={classNames('members-form__input primary-input', {
            'members-form__input--disabled': disabled
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
          className={classNames('primary-button', {
            'primary-button--disabled': disabled
          })}
          disabled={isButtonDisabled}
          onClick={this.handleAddNew}
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
    );
  }
}

MembersForm.propTypes = {
  disabled: PropTypes.bool,
  intl: IntlPropType.isRequired,
  pending: PropTypes.bool.isRequired,

  onAddNew: PropTypes.func.isRequired
};

export default injectIntl(MembersForm);
