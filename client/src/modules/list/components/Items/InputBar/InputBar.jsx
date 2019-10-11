import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import _trim from 'lodash/trim';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';
import validator from 'validator';

import { getCurrentUser } from 'modules/user/model/selectors';
import {
  RouterMatchPropType,
  UserPropType,
  IntlPropType
} from 'common/constants/propTypes';
import { addItem } from '../model/actions';
import { PlusIcon } from 'assets/images/icons';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { KeyCodes } from 'common/constants/enums';
import { validateWith } from 'common/utils/helpers';
import './InputBar.scss';

class InputBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessageId: '',
      isButtonDisabled: true,
      isFormVisible: false,
      itemName: '',
      pending: false
    };

    this.input = React.createRef();
  }

  componentDidUpdate() {
    const { isFormVisible, pending } = this.state;

    if (isFormVisible && !pending) {
      this.input.current.focus();
    }
  }

  handleEscapePress = event => {
    const { code } = event;
    const { itemName } = this.state;
    const isInputEmpty = _trim(itemName).length === 0;

    if (code === KeyCodes.ESCAPE && isInputEmpty) {
      this.hideForm();

      document.removeEventListener('keydown', this.handleEscapePress);
    }
  };

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState(
      {
        itemName: value
      },
      () => this.validateName(this.handleAddButtonStatus)
    );
  };

  handleAddButtonStatus = () => {
    const { errorMessageId, itemName } = this.state;

    this.setState({ isButtonDisabled: !itemName || errorMessageId });
  };

  handleAddItem = () => {
    const {
      addItem,
      currentUser,
      match: {
        params: { id }
      }
    } = this.props;
    const { errorMessageId, itemName } = this.state;
    const newItem = {
      authorId: currentUser.id,
      name: itemName
    };

    if (!errorMessageId) {
      this.setState({ pending: true });

      return addItem(newItem, id).finally(() => {
        this.setState({ itemName: '', pending: false });
        this.hideForm();
      });
    }
  };

  handleFormSubmit = event => {
    event.preventDefault();
    this.validateName(this.handleAddItem);
  };

  showForm = event => {
    event.preventDefault();

    this.setState({ isFormVisible: true });
  };

  validateName = callback => {
    const { itemName } = this.state;
    let errorMessageId;

    errorMessageId = validateWith(
      value => !validator.isEmpty(value, { ignore_whitespace: true })
    )('common.form.required-warning')(itemName);

    if (_trim(itemName)) {
      errorMessageId = validateWith(value =>
        validator.isLength(value, { min: 1, max: 32 })
      )('common.form.field-min-max')(itemName);
    }

    this.setState({ errorMessageId }, callback);
  };

  hideForm = () => this.setState({ errorMessageId: '', isFormVisible: false });

  handleBlur = () => {
    const { itemName } = this.state;
    const isInputEmpty = _trim(itemName).length === 0;

    if (isInputEmpty) {
      this.hideForm();
    }

    document.removeEventListener('keydown', this.handleEscapePress);
  };

  handleFocus = () => {
    document.addEventListener('keydown', this.handleEscapePress);
  };

  renderInputBar = () => {
    const {
      errorMessageId,
      isButtonDisabled,
      isFormVisible,
      itemName,
      pending
    } = this.state;
    const {
      intl: { formatMessage }
    } = this.props;

    return isFormVisible ? (
      <Fragment>
        <form className="input-bar__form" onSubmit={this.handleFormSubmit}>
          <input
            autoComplete="off"
            className="input-bar__input primary-input"
            disabled={pending}
            name="item name"
            onBlur={this.handleBlur}
            onFocus={this.handleFocus}
            onChange={this.handleNameChange}
            placeholder={formatMessage({ id: 'list.input-bar.placeholder' })}
            ref={this.input}
            required
            type="text"
            value={itemName}
          />
          <input
            className={classNames('input-bar__submit primary-button', {
              'input-bar__submit--disabled': isButtonDisabled
            })}
            disabled={isButtonDisabled}
            onClick={this.handleFormSubmit}
            type="submit"
            value={formatMessage({ id: 'list.input-bar.button' })}
          />
        </form>
        {errorMessageId && (
          <p className="error-message">
            <FormattedMessage id={errorMessageId} />
          </p>
        )}
      </Fragment>
    ) : (
      <button
        className="input-bar__button"
        onClick={this.showForm}
        type="button"
      >
        <PlusIcon />
        <FormattedMessage id="list.input-bar.add-new" />
      </button>
    );
  };

  render() {
    const { pending } = this.state;

    return (
      <div className="input-bar">
        {this.renderInputBar()}
        {pending && <Preloader size={PreloaderSize.SMALL} />}
      </div>
    );
  }
}

InputBar.propTypes = {
  currentUser: UserPropType.isRequired,
  intl: IntlPropType.isRequired,
  match: RouterMatchPropType.isRequired,

  addItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    { addItem }
  )
)(InputBar);
