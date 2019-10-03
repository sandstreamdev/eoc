import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import _trim from 'lodash/trim';
import _isEqual from 'lodash/isEqual';
import _flowRight from 'lodash/flowRight';
import Linkify from 'react-linkify';
import Textarea from 'react-textarea-autosize';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';

import Preloader, {
  PreloaderSize,
  PreloaderTheme
} from 'common/components/Preloader';
import {
  IntlPropType,
  RouterMatchPropType,
  UserPropType
} from 'common/constants/propTypes';
import { updateListItem } from '../model/actions';
import { KeyCodes, NodeTypes } from 'common/constants/enums';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { formatName, makeAbortablePromise } from 'common/utils/helpers';
import { getCurrentUser } from 'modules/user/model/selectors';
import './ListItemDescription.scss';

class ListItemDescription extends PureComponent {
  pendingPromise = null;

  constructor(props) {
    super(props);

    const { description } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      descriptionTextareaValue: trimmedDescription,
      isDescriptionUpdated: false,
      isFocused: false,
      isTextareaVisible: false,
      pending: false
    };

    this.descriptionTextarea = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    this.isDescriptionUpdated();
    const { isTextareaVisible: isPreviousIsTextareaVisible } = prevState;
    const { description: prevDescription } = prevProps;
    const { isTextareaVisible } = this.state;
    const { description } = this.props;

    if (!isPreviousIsTextareaVisible && isTextareaVisible) {
      this.descriptionTextarea.current.focus();
    }

    if (prevDescription !== description) {
      this.updateDescription();
    }
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  updateDescription = () => {
    const { description } = this.props;

    this.setState({ descriptionTextareaValue: description });
  };

  handleEscapePress = event => {
    const { code } = event;
    const { isFocused } = this.state;

    if (isFocused && code === KeyCodes.ESCAPE) {
      this.handleBlur();
    }
  };

  handleFocus = () => {
    const { onFocus } = this.props;

    this.setState({ isFocused: true });
    onFocus();
    document.addEventListener('keydown', this.handleEscapePress);
  };

  handleBlur = () => {
    const { onBlur } = this.props;

    onBlur();
    this.setState({ isFocused: false });
    document.removeEventListener('keydown', this.handleEscapePress);
    this.handleDescriptionUpdate();
  };

  handleShowTextarea = event => {
    const { nodeName } = event.target;

    if (nodeName === NodeTypes.LINK) {
      return;
    }

    this.setState({ isTextareaVisible: true });
  };

  handleHideTextarea = () => this.setState({ isTextareaVisible: false });

  handleDescriptionVisibility = () =>
    this.setState(({ isDescriptionVisible }) => ({
      isDescriptionVisible: !isDescriptionVisible
    }));

  handleDescriptionUpdate = event => {
    event && event.preventDefault();

    const {
      descriptionTextareaValue: description,
      isDescriptionUpdated
    } = this.state;
    const {
      currentUser: { id: userId, name: userName },
      disabled,
      intl: { formatMessage },
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

      const formattedName = formatName(userName, formatMessage);
      const userData = { userId, editedBy: formattedName };

      this.pendingPromise = makeAbortablePromise(
        updateListItem(formattedName, listId, itemId, userData, { description })
      );

      return this.pendingPromise.promise
        .then(() => {
          this.setState({ pending: false });
          this.handleHideTextarea();
        })
        .catch(err => {
          if (!(err instanceof AbortPromiseException)) {
            this.setState({ pending: false });
          }
        });
    }
    this.handleHideTextarea();
  };

  isDescriptionUpdated = () => {
    const { description: previousDescription } = this.props;
    const { descriptionTextareaValue } = this.state;

    const isDescriptionUpdated = !_isEqual(
      _trim(previousDescription),
      _trim(descriptionTextareaValue)
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
          className: 'list-item-description__link',
          target: '_blank'
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
    const { disabled, locked } = this.props;

    return (
      <button
        className="link-button"
        disabled={disabled || locked}
        onClick={this.handleShowTextarea}
        type="button"
      >
        <FormattedMessage id="list.list-description.add-button" />
      </button>
    );
  };

  renderTextarea = () => {
    const { descriptionTextareaValue, pending } = this.state;
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
        value={descriptionTextareaValue}
      />
    );
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ descriptionTextareaValue: value });
  };

  renderOverlay = () => <div className="list-item-description__overlay" />;

  render() {
    const { isDescriptionUpdated, isTextareaVisible } = this.state;
    const { description, disabled, locked } = this.props;

    const isSaveButtonVisible = isDescriptionUpdated && !disabled;
    const isTitleVisible = description || isTextareaVisible;

    return (
      <Fragment>
        {locked && this.renderOverlay()}
        <div
          className={classNames('list-item-description', {
            'list-item-description--disabled': locked
          })}
          onClick={disabled ? null : this.handleShowTextarea}
        >
          {isTitleVisible && (
            <h2 className="list-item-description__title">
              <FormattedMessage id="list.list-description.title" />
            </h2>
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
  currentUser: UserPropType.isRequired,
  description: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  intl: IntlPropType.isRequired,
  itemId: PropTypes.string.isRequired,
  locked: PropTypes.bool,
  match: RouterMatchPropType.isRequired,
  name: PropTypes.string.isRequired,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  updateListItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    mapStateToProps,
    { updateListItem }
  )
)(ListItemDescription);
