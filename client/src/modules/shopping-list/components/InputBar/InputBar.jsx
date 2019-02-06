import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { getCurrentUser } from 'modules/authorization/model/selectors';
import { getNewProductStatus } from 'modules/shopping-list/model/selectors';
import { StatusType, MessageType } from 'common/constants/enums';
import { StatusPropType, UserPropType } from 'common/constants/propTypes';
import MessageBox from 'common/components/MessageBox';
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
    const { newProductStatus } = this.props;
    return (
      <Fragment>
        {newProductStatus === StatusType.ERROR && (
          <MessageBox
            message="There was an error while adding new product. Try again later"
            type={MessageType.ERROR}
          />
        )}
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
  match: PropTypes.objectOf(PropTypes.any),
  newProductStatus: StatusPropType.isRequired,

  addProductToList: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  newProductStatus: getNewProductStatus(state)
});

export default withRouter(
  connect(
    mapStateToProps,
    { addProductToList }
  )(InputBar)
);
