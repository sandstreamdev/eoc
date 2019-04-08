import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { ListIcon } from 'assets/images/icons';
import { updateList } from 'modules/list/model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';

class ListHeader extends PureComponent {
  constructor(props) {
    super(props);

    const { details } = this.props;
    const { description, name } = details;

    this.state = {
      description,
      isDescriptionTextareaVisible: false,
      isNameInputVisible: false,
      name
    };

    this.descriptionTextarea = React.createRef();
    this.nameInput = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('mousedown', this.handleClick);
  }

  componentDidUpdate() {
    this.descriptionTextarea.current &&
      this.descriptionTextarea.current.focus();
    this.nameInput.current && this.nameInput.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('mousedown', this.handleClick);
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
    const {
      match: {
        params: { id }
      }
    } = this.props;
    const { code } = event;

    if (code === 'Enter' || code === 'Escape') {
      const action = isDescriptionTextareaVisible
        ? this.handleDescriptionUpdate
        : this.handleNameUpdate;

      action(id);
    }
  };

  handleClick = event => {
    const {
      isDescriptionTextareaVisible,
      isNameInputVisible,
      name
    } = this.state;
    const {
      match: {
        params: { id }
      }
    } = this.props;

    if (
      isDescriptionTextareaVisible &&
      !this.descriptionTextarea.current.contains(event.target)
    ) {
      this.setState({ isDescriptionTextareaVisible: false });
      this.handleDescriptionUpdate(id);
      return;
    }

    if (
      isNameInputVisible &&
      name.length >= 1 &&
      !this.nameInput.current.contains(event.target)
    ) {
      this.setState({ isNameInputVisible: false });
      this.handleNameUpdate(id);
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

    if (name.length >= 1) {
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

    if (previousDescription === description) {
      this.setState({ isDescriptionTextareaVisible: false });
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
            <input
              className="list-header__name-input primary-input"
              name="name"
              onChange={this.handleNameChange}
              ref={this.nameInput}
              type="text"
              value={name}
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
          <textarea
            className="cohort-header__desc-textarea primary-textarea"
            name="description"
            onChange={this.handleDescriptionChange}
            ref={this.descriptionTextarea}
            type="text"
            value={description}
          />
        ) : (
          <Fragment>
            {description && (
              <p
                className="cohort-header__description"
                data-id="description"
                onClick={this.handleDescriptionTextareaVisibility}
              >
                {description}
              </p>
            )}
            {!description && (
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
