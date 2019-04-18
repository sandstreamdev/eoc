import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _isEmpty from 'lodash/isEmpty';
import _trim from 'lodash/trim';
import classNames from 'classnames';

import { ListIcon } from 'assets/images/icons';
import { updateList } from 'modules/list/model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import NameInput from 'common/components/NameInput';
import DescriptionTextarea from 'common/components/DescriptionTextarea';
import Preloader, { PreloaderSize } from 'common/components/Preloader';

class ListHeader extends PureComponent {
  constructor(props) {
    super(props);

    const {
      details: { description, name }
    } = this.props;
    const trimmedDescription = description.trim();

    this.state = {
      description: trimmedDescription,
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      name,
      pendingForDescription: false,
      pendingForName: false
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

    this.setState({ name: value });
  };

  handleDescriptionChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ description: value });
  };

  handleKeyPress = event => {
    const { isDescriptionTextareaVisible } = this.state;
    const { code } = event;

    if (code === 'Enter' || code === 'Escape') {
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
      name
    } = this.state;

    if (isDescriptionTextareaVisible && isClickedOutside) {
      this.setState({ isDescriptionTextareaVisible: false });
      this.handleDescriptionUpdate();
      return;
    }

    if (isNameInputVisible && name.trim().length >= 1 && isClickedOutside) {
      this.setState({ isNameInputVisible: false });
      this.handleNameUpdate();
    }
  };

  handleNameUpdate = () => {
    const { name } = this.state;
    const {
      details,
      match: {
        params: { id }
      },
      updateList
    } = this.props;
    const { name: previousName } = details;

    if (previousName === name) {
      this.setState({ isNameInputVisible: false });
      return;
    }

    if (name.trim().length >= 1) {
      this.setState({ pendingForName: true });

      updateList(id, { name }).finally(() =>
        this.setState({ isNameInputVisible: false, pendingForName: false })
      );
    }
  };

  handleDescriptionUpdate = () => {
    const { description } = this.state;
    const {
      details,
      match: {
        params: { id }
      },
      updateList
    } = this.props;
    const { description: previousDescription } = details;

    if (previousDescription.trim() === description.trim()) {
      this.setState({
        description: description.trim(),
        isDescriptionTextareaVisible: false
      });
      return;
    }

    const updatedDescription = _isEmpty(_trim(description)) ? '' : description;

    this.setState({
      isDescriptionTextareaVisible: false,
      pendingForDescription: true
    });

    updateList(id, { description: updatedDescription })
      .then(() => this.setState({ description: updatedDescription }))
      .finally(() => this.setState({ pendingForDescription: false }));
  };

  renderDescription = () => {
    const {
      description,
      isDescriptionTextareaVisible,
      pendingForDescription
    } = this.state;

    const {
      details: { isOwner }
    } = this.props;

    if (!description && !isOwner) {
      return;
    }

    if (pendingForDescription) {
      return (
        <div className="list-header__bottom">
          <Preloader size={PreloaderSize.SMALL} />
        </div>
      );
    }

    return isDescriptionTextareaVisible ? (
      <DescriptionTextarea
        description={description}
        onClick={this.handleClick}
        onDescriptionChange={this.handleDescriptionChange}
        onKeyPress={this.handleKeyPress}
      />
    ) : (
      <Fragment>
        {description || !isOwner ? (
          <p
            className={classNames('list-header__description', {
              'list-header--clickable': isOwner
            })}
            data-id="description"
            onClick={isOwner ? this.handleDescriptionTextareaVisibility : null}
          >
            {description}
          </p>
        ) : (
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
    const { name, isNameInputVisible, pendingForName } = this.state;
    const {
      details: { isOwner }
    } = this.props;

    if (pendingForName) {
      return <Preloader size={PreloaderSize.SMALL} />;
    }

    return isNameInputVisible ? (
      <NameInput
        name={name}
        onClick={this.handleClick}
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

  render() {
    return (
      <div className="list-header">
        <div className="list-header__top">
          <ListIcon />
          {this.renderName()}
        </div>
        {this.renderDescription()}
      </div>
    );
  }
}

ListHeader.propTypes = {
  details: PropTypes.objectOf(PropTypes.any).isRequired,
  match: RouterMatchPropType.isRequired,

  updateList: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { updateList }
  )(ListHeader)
);
