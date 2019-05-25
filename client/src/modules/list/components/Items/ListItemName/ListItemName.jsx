import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { updateItemDetails } from '../model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';

class ListItemName extends PureComponent {
  constructor(props) {
    super(props);

    const { name } = this.props;

    this.state = {
      isNameInputFocused: false,
      name
    };

    this.nameInput = React.createRef();
  }

  componentDidUpdate() {
    const { isNameInputFocused } = this.state;

    if (isNameInputFocused) {
      document.addEventListener('keydown', this.handleKeyPress);
    }

    if (!isNameInputFocused) {
      document.removeEventListener('keydown', this.handleKeyPress);
    }
  }

  handleKeyPress = event => {
    const { code } = event;

    // Turn this into ENUM somewhere and change it everywhere across the project
    if (code === 'Enter' || code === 'Escape') {
      this.handleNameUpdate();
    }
  };

  handleNameUpdate = () => {
    const { name: updatedName } = this.state;
    const {
      itemId,
      updateItemDetails,
      name,
      match: {
        params: { id: listId }
      }
    } = this.props;
    const isNameUpdate = updatedName !== name;

    if (isNameUpdate) {
      updateItemDetails(listId, itemId, { name: updatedName });

      this.setState({ isNameInputFocused: false });
      this.nameInput.current.blur();
    }
  };

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    if (value.length > 0) {
      this.setState({ name: value });
    }
  };

  handleNameInputFocus = () => this.setState({ isNameInputFocused: true });

  handleNameInputBlur = () => this.setState({ isNameInputFocused: false });

  handleOnClick = event => event.stopPropagation();

  render() {
    const { isNameInputFocused, name } = this.state;
    const { isMember } = this.props;
    return (
      <input
        disabled={!isMember}
        type="text"
        className={classNames('list-item-name', {
          'primary-input': isNameInputFocused
        })}
        value={name}
        onClick={this.handleOnClick}
        onFocus={this.handleNameInputFocus}
        onBlur={this.handleNameInputBlur}
        onChange={this.handleNameChange}
        ref={this.nameInput}
      />
    );
  }
}

ListItemName.propTypes = {
  isMember: PropTypes.bool.isRequired,
  itemId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  match: RouterMatchPropType.isRequired,

  updateItemDetails: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { updateItemDetails }
  )(ListItemName)
);
