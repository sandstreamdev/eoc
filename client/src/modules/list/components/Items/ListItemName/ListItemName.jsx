import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { updateListItem } from '../model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import { KeyCodes } from 'common/constants/enums';
import { stopPropagation } from 'common/utils/helpers';

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

    if (code === KeyCodes.ENTER || code === KeyCodes.ESCAPE) {
      this.handleNameUpdate();
    }
  };

  handleNameUpdate = () => {
    const { name: updatedName } = this.state;
    const {
      itemId,
      match: {
        params: { id: listId }
      },
      name,
      updateListItem
    } = this.props;
    const isNameUpdated = updatedName !== name;

    if (isNameUpdated) {
      updateListItem(listId, itemId, { name: updatedName });

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

  handleOnClick = event => stopPropagation(event);

  render() {
    const { isNameInputFocused, name } = this.state;
    const { isMember } = this.props;
    return (
      <input
        className={classNames('list-item-name', {
          'primary-input': isNameInputFocused
        })}
        disabled={!isMember}
        onBlur={this.handleNameInputBlur}
        onChange={this.handleNameChange}
        onClick={this.handleOnClick}
        onFocus={this.handleNameInputFocus}
        ref={this.nameInput}
        type="text"
        value={name}
      />
    );
  }
}

ListItemName.propTypes = {
  isMember: PropTypes.bool.isRequired,
  itemId: PropTypes.string.isRequired,
  match: RouterMatchPropType.isRequired,
  name: PropTypes.string.isRequired,

  updateListItem: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { updateListItem }
  )(ListItemName)
);
