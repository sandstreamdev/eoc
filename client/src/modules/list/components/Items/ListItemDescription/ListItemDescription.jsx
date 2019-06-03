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
      isTextareaVisible: false,
      isFocused: false,
      pending: false
    };

    this.descriptionTextarea = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    this.isDescriptionUpdated();
    const { isTextareaVisible: previousIsTextareaVisible } = prevState;
    const { isTextareaVisible } = this.state;

    if (!previousIsTextareaVisible && isTextareaVisible) {
      this.descriptionTextarea.current.focus();
      this.handleFocus();
    }

    if (previousIsTextareaVisible && !isTextareaVisible) {
      this.handleBlur();
    }
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  handleKeyPress = event => {
    const { code } = event;
    const { isFocused } = this.state;

    if (isFocused && code === KeyCodes.ESCAPE) {
      this.handleBlur();
    }
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
    document.addEventListener('keydown', this.handleKeyPress);
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
    document.removeEventListener('keydown', this.handleKeyPress);
    this.handleDescriptionUpdate();
  };

  handleShowTextarea = () => this.setState({ isTextareaVisible: true });

  handleHideTextarea = () => this.setState({ isTextareaVisible: false });

  handleDescriptionVisibility = () =>
    this.setState(({ isDescriptionVisible }) => ({
      isDescriptionVisible: !isDescriptionVisible
    }));

  handleDescriptionUpdate = () => {
    const {
      descriptionInputValue: description,
      isDescriptionUpdated
    } = this.state;
    const {
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

    if (isDescriptionUpdated) {
      this.setState({ pending: true });

      this.pendingPromise = makeAbortablePromise(
        updateListItem(listId, itemId, { description }, name)
      );
      this.pendingPromise.promise
        .then(() => {
          this.setState({ pending: false });
          this.handleHideTextarea();
        })
        .catch(err => {
          if (!(err instanceof AbortPromiseException)) {
            this.setState({ pending: false });
          }
        });
    } else {
      this.handleHideTextarea();
    }
  };

  isDescriptionUpdated = () => {
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
        <p
          className={classNames('list-item-description__description', {
            'list-item-description__description--disabled': disabled || pending
          })}
        >
          {description}
        </p>
      </Linkify>
    );
  };

  renderAddButton = () => {
    const { disabled } = this.props;

    return (
      <button
        className="list-item-description__add-button"
        disabled={disabled}
        onClick={this.handleShowTextarea}
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
        inputRef={this.descriptionTextarea}
        maxRows={5}
        minRows={1}
        name="description"
        onBlur={this.handleBlur}
        onChange={disabled ? null : this.handleDescriptionChange}
        onFocus={this.handleFocus}
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
    const { isDescriptionUpdated, isTextareaVisible } = this.state;
    const { description, disabled } = this.props;

    const isSaveButtonVisible = isDescriptionUpdated && !disabled;
    const isTitleVisible = description || isTextareaVisible;

    return (
      <Fragment>
        <div onClick={disabled ? null : this.handleShowTextarea}>
          {isTitleVisible && (
            <h2 className="list-item-description__title">Description</h2>
          )}
          {isTextareaVisible ? (
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

export default withRouter(
  connect(
    null,
    { updateListItem }
  )(ListItemDescription)
);
