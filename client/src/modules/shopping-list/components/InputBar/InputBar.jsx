import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import { addProductToList } from './model/actions';

class InputBar extends Component {
  state = {
    productName: ''
  };

  handleNameChange = e => {
    this.setState({
      productName: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const {
      addProductToList,
      currentUser,
      match: {
        params: { id }
      }
    } = this.props;
    const { productName } = this.state;
    const newProduct = {
      authorName: currentUser.name,
      authorId: currentUser.id,
      isOrdered: false,
      name: productName
    };

    addProductToList(newProduct, id);

    this.setState({
      productName: ''
    });
  };

  render() {
    const { productName } = this.state;
    return (
      <Fragment>
        <div className="input-bar">
          <form className="input-bar__form" onSubmit={this.handleFormSubmit}>
            <input
              className="input-bar__input"
              onChange={this.handleNameChange}
              placeholder="What is missing?"
              required
              type="text"
              value={productName}
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
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired,

  addProductToList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { addProductToList }
  )(InputBar)
);
