import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import MessageBox from 'common/components/MessageBox';
import ProductsContainer from 'modules/shopping-list/components/ProductsContainer';
import Preloader from 'common/components/Preloader';
import { StatusType, MessageType } from 'common/constants/enums';
import {
  getFetchStatus,
  getItems
} from 'modules/shopping-list/model/selectors';
import InputBar from 'modules/shopping-list/components/InputBar';
import { StatusPropType } from 'common/constants/propTypes';
import { fetchItems } from 'modules/shopping-list/model/actions';

class ShoppingList extends Component {
  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    const { fetchItems } = this.props;
    fetchItems();
  };

  render() {
    const { fetchStatus, items } = this.props;

    const reversedItem = [...items].reverse();
    const archiveList = reversedItem.filter(item => item.isOrdered);
    const shoppingList = reversedItem.filter(item => !item.isOrdered);

    return (
      <Fragment>
        <div
          className={classNames('app-wrapper', {
            overlay: fetchStatus === StatusType.PENDING
          })}
        >
          {fetchStatus === StatusType.ERROR && (
            <MessageBox
              message="Fetching failed. Try to refresh the page."
              type={MessageType.ERROR}
            />
          )}
          <InputBar />
          <ProductsContainer products={shoppingList} />
          <ProductsContainer archived products={archiveList} />
          {fetchStatus === StatusType.PENDING && (
            <Preloader message="Fetching data..." />
          )}
        </div>
      </Fragment>
    );
  }
}

ShoppingList.propTypes = {
  fetchStatus: StatusPropType.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),

  fetchItems: PropTypes.func
};

const mapStateToProps = state => ({
  fetchStatus: getFetchStatus(state),
  items: getItems(state)
});

export default connect(
  mapStateToProps,
  { fetchItems }
)(ShoppingList);
