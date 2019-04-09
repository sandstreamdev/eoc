import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { ListIcon } from 'assets/images/icons';
import { updateList } from 'modules/list/model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import { whiteSpaceOnly } from 'common/utils/helpers';
import NameInput from 'common/components/NameInput';
import DescriptionTextarea from 'common/components/DescriptionTextarea';

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
      name
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
      updateList(id, { name });
      this.setState({ isNameInputVisible: false });
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

    if (whiteSpaceOnly(description)) {
      debugger;
      updateList(id, { description: '' });
      this.setState({ description: '' });
      return;
    }

    updateList(id, { description });
    this.setState({ isDescriptionTextareaVisible: false });
  };

  render() {
    const {
      description,
      isDescriptionTextareaVisible,
      isNameInputVisible,
      name
    } = this.state;

    return (
      <div className="list-header">
        <div className="list-header__top">
          <ListIcon />
          {isNameInputVisible ? (
            <NameInput
              handleClick={this.handleClick}
              handleKeyPress={this.handleKeyPress}
              handleNameChange={this.handleNameChange}
              name={name}
            />
          ) : (
            <h1
              className="list-header__heading"
              onClick={this.handleNameInputVisibility}
            >
              {name}
            </h1>
          )}
        </div>
        {isDescriptionTextareaVisible ? (
          <DescriptionTextarea
            description={description}
            handleDescriptionChange={this.handleDescriptionChange}
            handleClick={this.handleClick}
            handleKeyPress={this.handleKeyPress}
          />
        ) : (
          <Fragment>
            {description ? (
              <p
                className="cohort-header__description"
                data-id="description"
                onClick={this.handleDescriptionTextareaVisibility}
              >
                {description}
              </p>
            ) : (
              <button
                className="cohort-header__button link-button"
                onClick={this.handleDescriptionTextareaVisibility}
                type="button"
              >
                Add description
              </button>
            )}
          </Fragment>
        )}
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
