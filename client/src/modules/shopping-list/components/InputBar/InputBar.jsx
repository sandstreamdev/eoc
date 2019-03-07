import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { RouterMatchPropType, UserPropType } from 'common/constants/propTypes';
import { addItemToList } from './model/actions';

class InputBar extends Component {
  state = {
    itemName: ''
  };

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
  };

  render() {
    const { itemName } = this.state;
    return (
      <Fragment>
        <div className="input-bar">
          <form className="input-bar__form" onSubmit={this.handleFormSubmit}>
            <input
              className="input-bar__input primary-input"
              onChange={this.handleNameChange}
              placeholder="What is missing?"
              required
              type="text"
              value={itemName}
            />
            <input className="input-bar__submit" type="submit" />
          </form>
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
