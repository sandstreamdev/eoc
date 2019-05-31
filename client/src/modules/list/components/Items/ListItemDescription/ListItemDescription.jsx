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
      areDescriptionUpdated: false,
      descriptionInputValue: trimmedDescription,
      isEdited: false,
      isFocused: false,
      pending: false
    };
    this.descriptionTextarea = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    this.checkIfDescriptionUpdated();
    const { isEdited: prevIsEdited } = prevState;
    const { isEdited } = this.state;

    if (!prevIsEdited && isEdited) {
      this.descriptionTextarea.current.focus();
      this.handleFocus();
      document.addEventListener('keydown', this.handleKeyPress);
      document.addEventListener('mousedown', this.handleClickOutside);
    }

    if (prevIsEdited && !isEdited) {
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

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

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
    this.setState({ isEdited: true });
  };

  handleStopEditing = () => {
    this.setState({ isEdited: false });
  };

  handleDescriptionVisibility = () =>
    this.setState(({ isDescriptionVisible }) => ({
      isDescriptionVisible: !isDescriptionVisible
    }));

  checkIfDescriptionUpdated = () => {
    const { description: previousDescription } = this.props;

    const { descriptionInputValue } = this.state;

    const isDescriptionUpdated = !_isEqual(
      _trim(previousDescription),
      _trim(descriptionInputValue)
    );

    this.setState({ areDescriptionUpdated: isDescriptionUpdated });
  };

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

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ descriptionInputValue: value });
  };

  render() {
    const {
      areDescriptionUpdated,
      descriptionInputValue,
      isEdited,
      pending
    } = this.state;
    const { description, disabled } = this.props;

    return (
      <Fragment>
        <div onClick={disabled ? null : this.handleStartEditing}>
          {(description || isEdited) && (
            <h2 className="list-item-description__title">Description</h2>
          )}
          {isEdited ? (
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
          ) : (
            <Fragment>
              {description ? (
                <Linkify
                  properties={{
                    target: '_blank',
                    className: 'list-item-description__link'
                  }}
                >
                  <div
                    className={classNames(
                      'list-item-description__description',
                      {
                        'list-item-description__description--disabled': disabled
                      }
                    )}
                  >
                    {description}
                  </div>
                </Linkify>
              ) : (
                <button
                  className="list-item-description__add-button"
                  disabled={disabled}
                  onClick={this.handleStartEditing}
                  type="button"
                >
                  Add Description
                </button>
              )}
            </Fragment>
          )}
        </div>
        {areDescriptionUpdated && !disabled && (
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
        )}
      </Fragment>
    );
  }
}

ListItemDescription.propTypes = {
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  isOrdered: PropTypes.bool,
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
