import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _trim from 'lodash/trim';
import _isEqual from 'lodash/isEqual';
import Linkify from 'react-linkify';
import Textarea from 'react-textarea-autosize';
import classNames from 'classnames';

import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import { RouterMatchPropType } from 'common/constants/propTypes';
import { updateListItem } from '../model/actions';
import { KeyCodes } from 'common/constants/enums';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';

class ListItemDescription extends PureComponent {
  pendingPromise = null;

  constructor(props) {
    super(props);

    const { description } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      isDescriptionUpdated: false,
      descriptionInputValue: trimmedDescription,
      isDescriptionEdited: false,
      isFocused: false,
      pending: false
    };

    this.descriptionTextarea = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    this.checkIfDescriptionUpdated();
    const { isDescriptionEdited: previousIsDescriptionEdited } = prevState;
    const { isDescriptionEdited } = this.state;

    if (!previousIsDescriptionEdited && isDescriptionEdited) {
      this.descriptionTextarea.current.focus();
      this.handleFocus();
      document.addEventListener('keydown', this.handleKeyPress);
      document.addEventListener('mousedown', this.handleClickOutside);
    }

    if (previousIsDescriptionEdited && !isDescriptionEdited) {
      document.removeEventListener('keydown', this.handleKeyPress);
      document.removeEventListener('mousedown', this.handleClickOutside);
    }
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }

    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  handleKeyPress = event => {
    const { code } = event;
    const { isFocused } = this.state;

    if (isFocused && code === KeyCodes.ESCAPE) {
      this.handleDescriptionUpdate();
    }
  };

  handleFocus = () => this.setState({ isFocused: true });

  handleBlur = () => this.setState({ isFocused: false });

  handleClickOutside = event => {
    const { target } = event;

    if (
      this.descriptionTextarea &&
      !this.descriptionTextarea.current.contains(target)
    ) {
      this.handleDescriptionUpdate();
    }
  };

  handleStartEditing = () => {
    this.setState({ isDescriptionEdited: true });
  };

  handleStopEditing = () => {
    this.setState({ isDescriptionEdited: false });
  };

  handleDescriptionVisibility = () =>
    this.setState(({ isDescriptionVisible }) => ({
      isDescriptionVisible: !isDescriptionVisible
    }));

  handleDescriptionUpdate = () => {
    const { descriptionInputValue: description } = this.state;
    const {
      description: previousDescription,
      disabled,
      itemId,
      match: {
        params: { id: listId }
      },
      name,
      updateListItem
    } = this.props;

    if (disabled) {
      return;
    }

    const isDescriptionUpdated = !_isEqual(
      _trim(previousDescription),
      _trim(description)
    );

    if (isDescriptionUpdated) {
      this.setState({ pending: true });

      this.pendingPromise = makeAbortablePromise(
        updateListItem(listId, itemId, { description }, name)
      );
      this.pendingPromise.promise
        .then(() => {
          this.setState({ pending: false });
          this.handleStopEditing();
        })
        .catch(err => {
          if (!(err instanceof AbortPromiseException)) {
            this.setState({ pending: false });
          }
        });
    } else {
      this.handleStopEditing();
    }
  };

  checkIfDescriptionUpdated = () => {
    const { description: previousDescription } = this.props;

    const { descriptionInputValue } = this.state;

    const isDescriptionUpdated = !_isEqual(
      _trim(previousDescription),
      _trim(descriptionInputValue)
    );

    this.setState({ isDescriptionUpdated });
  };

  renderSaveButton = () => {
    const { disabled } = this.props;
    const { pending } = this.state;

    return (
      <div className="list-item-description__save-button">
        <button
          className="primary-button"
          disabled={disabled || pending}
          onClick={this.handleDescriptionUpdate}
          type="button"
        >
          Save
          {pending && (
            <Preloader
              size={PreloaderSize.SMALL}
              theme={PreloaderTheme.LIGHT}
            />
          )}
        </button>
      </div>
    );
  };

  renderDescription = () => {
    const { description, disabled } = this.props;
    const { pending } = this.state;

    return (
      <Linkify
        properties={{
          target: '_blank',
          className: 'list-item-description__link'
        }}
      >
        <div
          className={classNames('list-item-description__description', {
            'list-item-description__description--disabled': disabled || pending
          })}
        >
          {description}
        </div>
      </Linkify>
    );
  };

  renderAddButton = () => {
    const { disabled } = this.props;

    return (
      <button
        className="list-item-description__add-button"
        disabled={disabled}
        onClick={this.handleStartEditing}
        type="button"
      >
        Add Description
      </button>
    );
  };

  renderTextarea = () => {
    const { descriptionInputValue, pending } = this.state;
    const { disabled } = this.props;

    return (
      <Textarea
        className="list-item-description__edit-field"
        disabled={disabled || pending}
        maxRows={5}
        minRows={1}
        name="description"
        onChange={disabled ? null : this.handleDescriptionChange}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        inputRef={this.descriptionTextarea}
        type="text"
        value={descriptionInputValue}
      />
    );
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ descriptionInputValue: value });
  };

  render() {
    const { isDescriptionUpdated, isDescriptionEdited } = this.state;
    const { description, disabled } = this.props;

    const isSaveButtonVisible = isDescriptionUpdated && !disabled;
    const isTitleVisible = description || isDescriptionEdited;

    return (
      <Fragment>
        <div onClick={disabled ? null : this.handleStartEditing}>
          {isTitleVisible && (
            <h2 className="list-item-description__title">Description</h2>
          )}
          {isDescriptionEdited ? (
            this.renderTextarea()
          ) : (
            <Fragment>
              {description ? this.renderDescription() : this.renderAddButton()}
            </Fragment>
          )}
        </div>
        {isSaveButtonVisible && this.renderSaveButton()}
      </Fragment>
    );
  }
}

ListItemDescription.propTypes = {
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  itemId: PropTypes.string.isRequired,
  match: RouterMatchPropType.isRequired,
  name: PropTypes.string.isRequired,

  updateListItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

export default withRouter(
  connect(
    mapStateToProps,
    { updateListItem }
  )(ListItemDescription)
);
