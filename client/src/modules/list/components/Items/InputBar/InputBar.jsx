import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { addItem } from '../model/actions';
import { PlusIcon } from 'assets/images/icons';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { PENDING_DELAY } from 'common/constants/variables';

class InputBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFormVisible: false,
      itemName: '',
      pending: false
    };
    this.input = React.createRef();
  }

  componentDidUpdate() {
    const { isFormVisible, pending } = this.state;
    isFormVisible && !pending && this.input.current.focus();
  }

  handleNameChange = event =>
    this.setState({
      itemName: event.target.value
    });

  handleFormSubmit = e => {
    e.preventDefault();
    const {
      addItem,
      currentUser,
      match: {
        params: { id }
      }
    } = this.props;
    const { itemName } = this.state;
    const newItem = {
      authorName: currentUser.name,
      authorId: currentUser.id,
      name: itemName
    };

    const delayedPending = setTimeout(
      () => this.setState({ pending: true }),
      PENDING_DELAY
    );

    addItem(newItem, id).finally(() => {
      clearTimeout(delayedPending);
      this.setState({ itemName: '', pending: false });
      this.hideForm();
    });
  };

  showForm = () => this.setState({ isFormVisible: true });

  hideForm = () => this.setState({ isFormVisible: false });

  renderInputBar = () => {
    const { itemName, isFormVisible, pending } = this.state;

    if (pending) {
      return <Preloader size={PreloaderSize.SMALL} />;
    }

    return isFormVisible ? (
      <form className="input-bar__form" onSubmit={this.handleFormSubmit}>
        <input
          className="input-bar__input primary-input"
          name="item name"
          onChange={this.handleNameChange}
          placeholder="What is missing?"
          ref={this.input}
          required
          type="text"
          value={itemName}
        />
        <input className="input-bar__submit" type="submit" />
      </form>
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
    return <div className="input-bar">{this.renderInputBar()}</div>;
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
