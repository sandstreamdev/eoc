import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { UserPropType } from 'common/constants/propTypes';
import { addProduct } from './model/actions';

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
    const { addProduct, currentUser } = this.props;
    const { productName } = this.state;
    const newProduct = {
      authorName: currentUser.name,
      authorId: currentUser.id,
      isOrdered: false,
      name: productName
    };

    addProduct(newProduct);

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

  addProduct: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { addProduct }
)(InputBar);
