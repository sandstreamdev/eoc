import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { updateListItem } from '../model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import { KeyCodes } from 'common/constants/enums';
import Preloader from 'common/components/Preloader';

class ListItemName extends PureComponent {
  constructor(props) {
    super(props);

    const { name } = this.props;

    this.state = {
      isNameInputFocused: false,
      isTipVisible: false,
      name,
      pending: false
    };

    this.nameInput = React.createRef();
    this.listItemName = React.createRef();
  }

  componentDidUpdate() {
    const { name } = this.state;

    if (name.length === 0) {
      this.nameInput.current.focus();
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
    const canBeUpdated = updatedName.trim().length > 1;

    if (canBeUpdated && isNameUpdated) {
      this.setState({ pending: true });

      updateListItem(listId, itemId, { name: updatedName }, name).finally(
        () => {
          this.setState({
            pending: false,
            isTipVisible: false
          });

          this.handleNameInputBlur();
        }
      );
    }

    if (!canBeUpdated) {
      this.setState({ isTipVisible: true });
    }
  };

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState({ name: value });
  };

  renderTip = () => (
    <span className="error-message">Name can not be empty.</span>
  );

  handleNameInputFocus = () => {
    const { onFocus } = this.props;

    onFocus();
    this.setState({ isNameInputFocused: true });
    document.addEventListener('keydown', this.handleKeyPress);
    document.addEventListener('mousedown', this.handleClickOutside);
  };

  handleNameInputBlur = () => {
    const { onBlur } = this.props;

    onBlur();
    this.nameInput.current.blur();
    this.setState({ isNameInputFocused: false });
    document.removeEventListener('keydown', this.handleKeyPress);
    document.removeEventListener('mousedown', this.handleClickOutside);
  };

  handleOnClick = event => event.stopPropagation();

  handleClickOutside = event => {
    const { target } = event;

    if (this.listItemName && !this.listItemName.current.contains(target)) {
      this.handleNameUpdate();
    }
  };

  render() {
    const { isNameInputFocused, isTipVisible, name, pending } = this.state;
    const { isMember } = this.props;
    return (
      <div ref={this.listItemName}>
        <div className="list-item-name">
          <input
            className={classNames('list-item-name__input', {
              'primary-input': isNameInputFocused,
              'list-item-name__input--disabled': pending
            })}
            disabled={!isMember || pending}
            onBlur={this.handleNameInputBlur}
            onChange={this.handleNameChange}
            onClick={this.handleOnClick}
            onFocus={this.handleNameInputFocus}
            ref={this.nameInput}
            type="text"
            value={name}
          />
          {pending && <Preloader />}
        </div>
        {isTipVisible && this.renderTip()}
      </div>
    );
  }
}

ListItemName.propTypes = {
  isMember: PropTypes.bool.isRequired,
  itemId: PropTypes.string.isRequired,
  match: RouterMatchPropType.isRequired,
  name: PropTypes.string.isRequired,

  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  updateListItem: PropTypes.func.isRequired
};

export default withRouter(
  connect(
    null,
    { updateListItem }
  )(ListItemName)
);
