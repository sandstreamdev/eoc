import React, { Component, Fragment } from 'react';
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
      itemName: '',
      isFormVisible: false
    };
    this.input = React.createRef();
  }

  componentDidUpdate() {
    const { isFormVisible } = this.state;
    isFormVisible && this.input.current.focus();
  }

  handleNameChange = e => {
    this.setState({
      itemName: e.target.value
    });
  };

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
      isOrdered: false,
      name: itemName
    };

    addItemToList(newItem, id);

    this.setState({
      itemName: ''
    });
    this.handleFormVisibility();
  };

  handleFormVisibility = () => {
    const { isFormVisible } = this.state;
    this.setState({ isFormVisible: !isFormVisible });
  };

  render() {
    const { itemName, isFormVisible } = this.state;
    return (
      <Fragment>
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
              onClick={this.handleFormVisibility}
              type="button"
            >
              <PlusIcon />
              Add new item
            </button>
          )}
        </div>
      </Fragment>
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
