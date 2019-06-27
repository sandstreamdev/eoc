import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import { ListIcon } from 'assets/images/icons';
import { updateList, changeType } from 'modules/list/model/actions';
import { RouterMatchPropType, IntlPropType } from 'common/constants/propTypes';
import NameInput from 'common/components/NameInput';
import DescriptionTextarea from 'common/components/DescriptionTextarea';
import { ListType } from '../consts';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { KeyCodes } from 'common/constants/enums';
import Dialog from 'common/components/Dialog';

class ListHeader extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description, name, type }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      descriptionInputValue: trimmedDescription,
      isDescriptionTextareaVisible: false,
      isDialogVisible: false,
      isNameInputVisible: false,
      isTipVisible: false,
      listType: type,
      nameInputValue: name,
      newType: null,
      pendingForDescription: false,
      pendingForName: false,
      pendingForType: false
    };
  }

  componentDidUpdate() {
    const { isTipVisible, nameInputValue } = this.state;

    if (isTipVisible && nameInputValue) {
      this.hideTip();
    }
  }

  showNameInput = () =>
    this.setState({
      isNameInputVisible: true
    });

  showDescriptionTextarea = () =>
    this.setState({
      isDescriptionTextareaVisible: true
    });

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ nameInputValue: value }, () => {
      this.handleTipVisibility();
    });
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ descriptionInputValue: value });
  };

  handleKeyPress = event => {
    const { isDescriptionTextareaVisible } = this.state;
    const { code } = event;

    if (code === KeyCodes.ESCAPE) {
      const action = isDescriptionTextareaVisible
        ? this.handleDescriptionUpdate
        : this.handleNameUpdate;

      return action();
    }

    if (code === KeyCodes.ENTER) {
      this.handleNameUpdate();
    }
  };

  handleClick = (event, isClickedOutside) => {
    const {
      isDescriptionTextareaVisible,
      isNameInputVisible,
      nameInputValue
    } = this.state;
    const {
      details: { name }
    } = this.props;

    if (isDescriptionTextareaVisible && isClickedOutside) {
      this.handleDescriptionUpdate();

      return;
    }

    if (isNameInputVisible && isClickedOutside) {
      if (_trim(nameInputValue).length > 0) {
        return this.handleNameUpdate();
      }
      this.setState({ isNameInputVisible: false, nameInputValue: name });
    }
  };

  handleNameUpdate = () => {
    const {
      details,
      match: {
        params: { id }
      },
      updateBreadcrumbs,
      updateList
    } = this.props;
    const { nameInputValue } = this.state;
    const nameToUpdate = _trim(nameInputValue);
    const { name: previousName } = details;

    if (_trim(previousName) === nameToUpdate) {
      this.setState({ isNameInputVisible: false });

      return;
    }

    if (nameToUpdate.length >= 1) {
      this.setState({ pendingForName: true });

      updateList(id, { name: nameToUpdate }, previousName).finally(() => {
        this.setState({
          isNameInputVisible: false,
          nameInputValue: nameToUpdate,
          pendingForName: false
        });

        updateBreadcrumbs();
      });
    }
  };

  handleDescriptionUpdate = () => {
    const {
      details,
      match: {
        params: { id }
      },
      updateList
    } = this.props;
    const { descriptionInputValue } = this.state;
    const descriptionToUpdate = _trim(descriptionInputValue);
    const { description: previousDescription, name } = details;

    if (_trim(previousDescription) === descriptionToUpdate) {
      this.setState({ isDescriptionTextareaVisible: false });

      return;
    }

    const updatedDescription = _isEmpty(descriptionToUpdate)
      ? ''
      : descriptionToUpdate;

    this.setState({ pendingForDescription: true });

    updateList(id, { description: updatedDescription }, name).finally(() =>
      this.setState({
        isDescriptionTextareaVisible: false,
        descriptionInputValue: updatedDescription,
        pendingForDescription: false
      })
    );
  };

  handleChangingType = () => {
    const {
      changeType,
      details: { name },
      match: {
        params: { id: listId }
      }
    } = this.props;
    const { newType } = this.state;

    this.setState({ pendingForType: true });

    changeType(listId, name, newType).finally(() => {
      this.setState({ pendingForType: false, listType: newType });
      this.hideDialog();
    });
  };

  handleTipVisibility = () => {
    const { nameInputValue } = this.state;
    const isItemNameEmpty = !_trim(nameInputValue);

    if (isItemNameEmpty) {
      this.setState({ isTipVisible: true });
    }
  };

  hideTip = () => this.setState({ isTipVisible: false });

  showDialog = event => {
    const { value } = event.target;

    this.setState({ isDialogVisible: true, newType: value });
  };

  hideDialog = () => {
    this.setState({ isDialogVisible: false, newType: null });
  };

  renderDescription = () => {
    const {
      descriptionInputValue,
      isDescriptionTextareaVisible,
      pendingForDescription
    } = this.state;
    const {
      details: { description, isOwner }
    } = this.props;

    if (!description && !isOwner) {
      return;
    }

    return isDescriptionTextareaVisible ? (
      <DescriptionTextarea
        description={descriptionInputValue}
        disabled={pendingForDescription}
        onClick={this.handleClick}
        onDescriptionChange={this.handleDescriptionChange}
        onKeyPress={this.handleKeyPress}
      />
    ) : (
      <Fragment>
        {description && (
          <p
            className={classNames('list-header__description', {
              'list-header--clickable': isOwner
            })}
            data-id="description"
            onClick={isOwner ? this.showDescriptionTextarea : null}
          >
            {description}
          </p>
        )}
        {isOwner && !description && (
          <button
            className="list-header__button link-button"
            onClick={this.showDescriptionTextarea}
            type="button"
          >
            <FormattedMessage id="list.list-header.add-button" />
          </button>
        )}
      </Fragment>
    );
  };

  renderName = () => {
    const {
      isNameInputVisible,
      isTipVisible,
      nameInputValue,
      pendingForName
    } = this.state;
    const {
      details: { isOwner, name }
    } = this.props;

    return isNameInputVisible ? (
      <div>
        <NameInput
          disabled={pendingForName}
          name={nameInputValue}
          onClick={isOwner ? this.handleClick : null}
          onKeyPress={this.handleKeyPress}
          onNameChange={this.handleNameChange}
        />
        {isTipVisible && <p className="error-message">Name can not be empty</p>}
      </div>
    ) : (
      <h1
        className={classNames('list-header__heading', {
          'list-header--clickable': isOwner
        })}
        onClick={isOwner ? this.showNameInput : null}
      >
        {name}
      </h1>
    );
  };

  renderListType = () => {
    const {
      intl: { formatMessage }
    } = this.props;
    const { listType, pendingForType } = this.state;

    return (
      <select
        className="list-header__select primary-select"
        value={listType}
        disabled={pendingForType}
        onChange={this.showDialog}
      >
        <option className="list-header__option" value={ListType.LIMITED}>
          {formatMessage({ id: 'list.type.limited' })}
        </option>
        <option className="list-header__option" value={ListType.SHARED}>
          {formatMessage({ id: 'list.type.shared' })}
        </option>
      </select>
    );
  };

  renderDialog = () => {
    const { newType: value, pendingForType } = this.state;
    const {
      details: { name },
      intl: { formatMessage }
    } = this.props;

    return (
      <Dialog
        onCancel={this.hideDialog}
        onConfirm={this.handleChangingType}
        pending={pendingForType}
        title={formatMessage(
          {
            id: pendingForType
              ? 'list.index.changing-type'
              : 'list.index.change-type-question'
          },
          { name, value }
        )}
      />
    );
  };

  render() {
    const {
      details: { isOwner, type },
      isCohortList
    } = this.props;
    const {
      isDialogVisible,
      pendingForDescription,
      pendingForName,
      pendingForType
    } = this.state;

    return (
      <div className="list-header">
        <div className="list-header__top">
          <div className="list-header__name">
            <ListIcon />
            {this.renderName()}
          </div>
          {pendingForName && <Preloader size={PreloaderSize.SMALL} />}
          {isCohortList && (
            <div className="list-header__type">
              {isOwner ? (
                <Fragment>
                  {this.renderListType()}
                  {pendingForType && <Preloader size={PreloaderSize.SMALL} />}
                </Fragment>
              ) : (
                type
              )}
            </div>
          )}
        </div>
        <div className="list-header__bottom">
          {this.renderDescription()}
          {pendingForDescription && <Preloader size={PreloaderSize.SMALL} />}
        </div>
        {isDialogVisible && this.renderDialog()}
      </div>
    );
  }
}

ListHeader.propTypes = {
  details: PropTypes.objectOf(PropTypes.any).isRequired,
  intl: IntlPropType.isRequired,
  isCohortList: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  changeType: PropTypes.func.isRequired,
  updateBreadcrumbs: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired
};

export default _flowRight(
  injectIntl,
  withRouter,
  connect(
    null,
    { changeType, updateList }
  )
)(ListHeader);
