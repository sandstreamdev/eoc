import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import _trim from 'lodash/trim';
import io from 'socket.io-client';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { addItem } from '../model/actions';
import { PlusIcon } from 'assets/images/icons';
import Preloader, { PreloaderSize } from 'common/components/Preloader';

class InputBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isButtonDisabled: true,
      isFormVisible: false,
      isTipVisible: false,
      itemName: '',
      pending: false
    };

    this.input = React.createRef();
    this.socket = undefined;
  }

  componentDidUpdate() {
    const { isFormVisible, pending, isTipVisible } = this.state;

    if (isFormVisible && !pending) {
      this.input.current.focus();
    }

    if (isTipVisible) {
      this.hideTipAfterTimeout();
    }

    if (!this.socket) {
      this.socket = io('http://localhost:8080');
    }
  }

  handleNameChange = event => {
    const {
      target: { value }
    } = event;

    this.setState(
      {
        itemName: value
      },
      () => {
        this.handleAddButtonStatus();
        this.handleTipVisibility();
      }
    );
  };

  handleAddButtonStatus = () => {
    const { itemName } = this.state;

    this.setState({ isButtonDisabled: !itemName });
  };

  handleTipVisibility = () => {
    const { itemName } = this.state;
    const isItemNameEmpty = !_trim(itemName);

    if (isItemNameEmpty) {
      this.setState({ isTipVisible: true });
    }
  };

  hideTipAfterTimeout = () =>
    setTimeout(() => this.setState({ isTipVisible: false }), 5000);

  handleFormSubmit = event => {
    event.preventDefault();
    const {
      addItem,
      currentUser,
      match: {
        params: { id }
      }
    } = this.props;
    const { itemName } = this.state;
    const newItem = {
      authorId: currentUser.id,
      name: itemName
    };

    if (_trim(itemName)) {
      this.setState({ pending: true });
      const { socket } = this;

      return addItem(newItem, id, socket).finally(() => {
        this.setState({ itemName: '', pending: false });
        this.hideForm();
      });
    }

    this.handleTipVisibility();
  };

  showForm = () => this.setState({ isFormVisible: true });

  hideForm = () => this.setState({ isFormVisible: false });

  renderInputBar = () => {
    const {
      isButtonDisabled,
      isFormVisible,
      isTipVisible,
      itemName,
      pending
    } = this.state;

    return isFormVisible ? (
      <Fragment>
        <form className="input-bar__form" onSubmit={this.handleFormSubmit}>
          <input
            className="input-bar__input primary-input"
            disabled={pending}
            name="item name"
            onChange={this.handleNameChange}
            placeholder="What is missing?"
            ref={this.input}
            required
            type="text"
            value={itemName}
          />
          <input
            className={classNames('input-bar__submit primary-button', {
              'input-bar__submit--disabled': isButtonDisabled
            })}
            disabled={isButtonDisabled}
            type="submit"
            value="add"
          />
        </form>
        {isTipVisible && <p className="error-message">Name can not be empty</p>}
      </Fragment>
    ) : (
      <button
        className="input-bar__button"
        onClick={this.showForm}
        type="button"
      >
        <PlusIcon />
        Add new item
      </button>
    );
  };

  render() {
    const { pending } = this.state;

    return (
      <div className="input-bar">
        {this.renderInputBar()}
        {pending && <Preloader size={PreloaderSize.SMALL} />}
      </div>
    );
  }
}

InputBar.propTypes = {
  currentUser: UserPropType.isRequired,
  match: RouterMatchPropType.isRequired,

  addItem: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { addItem }
  )(InputBar)
);
