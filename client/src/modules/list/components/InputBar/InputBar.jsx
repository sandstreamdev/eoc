import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { addItemToList } from './model/actions';
import { PlusIcon } from 'assets/images/icons';

class InputBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFormVisible: false,
      itemName: ''
    };
    this.input = React.createRef();
  }

  componentDidUpdate() {
    const { isFormVisible } = this.state;
    isFormVisible && this.input.current.focus();
  }

  handleNameChange = event =>
    this.setState({
      itemName: event.target.value
    });

  handleFormSubmit = e => {
    e.preventDefault();
    const {
      addItemToList,
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

    addItemToList(newItem, id);

    this.setState({
      itemName: ''
    });
    this.hideForm();
  };

  showForm = () => this.setState({ isFormVisible: true });

  hideForm = () => this.setState({ isFormVisible: false });

  render() {
    const { itemName, isFormVisible } = this.state;
    return (
      <div className="input-bar">
        {isFormVisible ? (
          <form className="input-bar__form" onSubmit={this.handleFormSubmit}>
            <input
              className="input-bar__input primary-input"
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
        )}
      </div>
    );
  }
}

InputBar.propTypes = {
  currentUser: UserPropType.isRequired,
  match: RouterMatchPropType.isRequired,

  addItemToList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { addItemToList }
  )(InputBar)
);
