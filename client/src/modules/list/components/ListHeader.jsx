import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import classNames from 'classnames';

import { ListIcon } from 'assets/images/icons';
import { updateList, changeType } from 'modules/list/model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import NameInput from 'common/components/NameInput';
import DescriptionTextarea from 'common/components/DescriptionTextarea';
import { ListType } from '../consts';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { KeyCodes } from 'common/constants/enums';

class ListHeader extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description, name }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      descriptionInputValue: trimmedDescription,
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      nameInputValue: name,
      pendingForDescription: false,
      pendingForName: false,
      pendingForType: false
    };
  }

  handleNameInputVisibility = () =>
    this.setState(({ isNameInputVisible }) => ({
      isNameInputVisible: !isNameInputVisible
    }));

  handleDescriptionTextareaVisibility = () =>
    this.setState(({ isDescriptionTextareaVisible }) => ({
      isDescriptionTextareaVisible: !isDescriptionTextareaVisible
    }));

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ nameInputValue: value });
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

    if (code === KeyCodes.ENTER || code === KeyCodes.ESCAPE) {
      const action = isDescriptionTextareaVisible
        ? this.handleDescriptionUpdate
        : this.handleNameUpdate;

      action();
    }
  };

  handleClick = (event, isClickedOutside) => {
    const {
      isDescriptionTextareaVisible,
      isNameInputVisible,
      nameInputValue
    } = this.state;

    if (isDescriptionTextareaVisible && isClickedOutside) {
      this.handleDescriptionUpdate();
      return;
    }

    if (
      isNameInputVisible &&
      _trim(nameInputValue).length >= 1 &&
      isClickedOutside
    ) {
      this.handleNameUpdate();
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

  handleChangingType = event => {
    const {
      target: { value }
    } = event;
    const {
      changeType,
      details: { name },
      match: {
        params: { id: listId }
      }
    } = this.props;

    this.setState({ pendingForType: true });

    changeType(listId, name, value).finally(() =>
      this.setState({ pendingForType: false })
    );
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
            onClick={isOwner ? this.handleDescriptionTextareaVisibility : null}
          >
            {description}
          </p>
        )}
        {isOwner && !description && (
          <button
            className="list-header__button link-button"
            onClick={this.handleDescriptionTextareaVisibility}
            type="button"
          >
            Add description
          </button>
        )}
      </Fragment>
    );
  };

  renderName = () => {
    const { isNameInputVisible, nameInputValue, pendingForName } = this.state;
    const {
      details: { isOwner, name }
    } = this.props;

    return isNameInputVisible ? (
      <NameInput
        disabled={pendingForName}
        name={nameInputValue}
        onClick={isOwner ? this.handleClick : null}
        onKeyPress={this.handleKeyPress}
        onNameChange={this.handleNameChange}
      />
    ) : (
      <h1
        className={classNames('list-header__heading', {
          'list-header--clickable': isOwner
        })}
        onClick={isOwner ? this.handleNameInputVisibility : null}
      >
        {name}
      </h1>
    );
  };

  renderListType = () => {
    const {
      details: { type }
    } = this.props;
    const { pendingForType } = this.state;

    return (
      <select
        className="list-header__select primary-select"
        defaultValue={type}
        disabled={pendingForType}
        onChange={this.handleChangingType}
      >
        <option className="list-header__option" value={ListType.LIMITED}>
          {ListType.LIMITED}
        </option>
        <option className="list-header__option" value={ListType.SHARED}>
          {ListType.SHARED}
        </option>
      </select>
    );
  };

  render() {
    const {
      details: { isOwner, type },
      isCohortList
    } = this.props;
    const {
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
      </div>
    );
  }
}

ListHeader.propTypes = {
  details: PropTypes.objectOf(PropTypes.any).isRequired,
  isCohortList: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  changeType: PropTypes.func.isRequired,
  updateBreadcrumbs: PropTypes.func.isRequired,
  updateList: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { changeType, updateList }
  )(ListHeader)
);
