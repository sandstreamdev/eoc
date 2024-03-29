import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';
import _trim from 'lodash/trim';
import isEmpty from 'validator/lib/isEmpty';
import isLength from 'validator/lib/isLength';
import { FormattedMessage } from 'react-intl';

import { updateListItem } from '../model/actions';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { KeyCodes } from 'common/constants/enums';
import Preloader from 'common/components/Preloader';
import { getCurrentUser } from 'modules/user/model/selectors';
import './ListItemName.scss';
import {
  attachBeforeUnloadEvent,
  removeBeforeUnloadEvent
} from 'common/utils/events';
import { validateWith } from 'common/utils/helpers';

class ListItemName extends PureComponent {
  constructor(props) {
    super(props);

    const { name } = this.props;

    this.state = {
      errorMessageId: '',
      isDirty: false,
      isNameInputFocused: false,
      name,
      pending: false
    };

    this.nameInput = React.createRef();
    this.listItemName = React.createRef();
  }

  componentDidMount() {
    attachBeforeUnloadEvent(this.handleWindowBeforeUnload);
  }

  componentDidUpdate(prevProps) {
    const { name: previousName } = prevProps;
    const { name } = this.props;
    const { name: nameInputValue } = this.state;
    const dataHasChanged = previousName !== nameInputValue;

    if (name.length === 0) {
      this.nameInput.current.focus();
    }

    if (previousName !== name) {
      this.updateNameWS(name);
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

  updateNameWS = updatedName => this.setState({ name: updatedName });

  handleKeyPress = event => {
    const { code } = event;

    if (code === KeyCodes.ENTER || code === KeyCodes.ESCAPE) {
      this.validateName(this.handleNameUpdate);
    }
  };

  handleNameUpdate = () => {
    const { name: updatedName, errorMessageId } = this.state;
    const {
      currentUser: { id: userId, name: userName },
      itemId,
      match: {
        params: { id: listId }
      },
      name,
      onBlur,
      onPending,
      updateListItem
    } = this.props;
    const isNameUpdated = updatedName !== name;

    if (isNameUpdated && !errorMessageId) {
      this.setState({ pending: true });

      const userData = { userId, editedBy: userName };

      onPending();
      updateListItem(name, listId, itemId, userData, {
        name: updatedName
      }).finally(() => {
        this.setState({
          pending: false
        });

        this.handleNameInputBlur();
        onBlur();
      });
    }
  };

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ name: value });
  };

  renderError = () => {
    const { errorMessageId } = this.state;

    return (
      <span className="error-message">
        <FormattedMessage id={errorMessageId} />
      </span>
    );
  };

  handleNameInputFocus = () => {
    const { onFocus } = this.props;

    onFocus();
    this.setState({ isNameInputFocused: true });
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  handleNameInputBlur = () => {
    const { onBlur } = this.props;
    const { name } = this.state;

    if (name) {
      onBlur();
      this.nameInput.current.blur();
      this.setState({ isNameInputFocused: false });
      document.removeEventListener('keydown', this.handleKeyPress);
      document.removeEventListener('mousedown', this.handleClickOutside);

      return;
    }

    this.nameInput.current.focus();
  };

  handleOnClick = event => {
    event.stopPropagation();
    this.nameInput.current.focus();
  };

  handleClickOutside = event => {
    const { target } = event;

    if (this.listItemName && !this.listItemName.current.contains(target)) {
      this.validateName(this.handleNameUpdate);
    }
  };

  validateName = callback => {
    const { name } = this.state;
    let errorMessageId;

    errorMessageId = validateWith(
      value => !isEmpty(value, { ignore_whitespace: true })
    )('common.form.required-warning')(name);

    if (_trim(name)) {
      errorMessageId = validateWith(value =>
        isLength(value, { min: 1, max: 32 })
      )('common.form.field-min-max')(name);
    }

    this.setState({ errorMessageId }, callback);
  };

  render() {
    const { isNameInputFocused, errorMessageId, name, pending } = this.state;
    const { isMember, locked } = this.props;

    return (
      <div ref={this.listItemName}>
        <div className="list-item-name">
          <input
            className={classNames('list-item-name__input', {
              'primary-input': isNameInputFocused,
              'list-item-name__input--disabled': pending || locked
            })}
            disabled={!isMember || pending || locked}
            onBlur={this.handleNameInputBlur}
            onChange={this.handleNameChange}
            onClick={this.handleOnClick}
            onFocus={this.handleNameInputFocus}
            ref={this.nameInput}
            type="text"
            value={name}
          />
          {pending && <Preloader />}
        </div>
        {errorMessageId && this.renderError()}
      </div>
    );
  }
}

ListItemName.propTypes = {
  currentUser: UserPropType.isRequired,
  isMember: PropTypes.bool.isRequired,
  itemId: PropTypes.string.isRequired,
  locked: PropTypes.bool,
  match: RouterMatchPropType.isRequired,
  name: PropTypes.string.isRequired,

  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onPending: PropTypes.func.isRequired,
  updateListItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  withRouter,
  connect(mapStateToProps, { updateListItem })
)(ListItemName);
