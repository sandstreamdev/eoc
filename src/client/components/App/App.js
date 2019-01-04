import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Footer from '../Footer';
import Header from '../Header';
import InputBar from '../InputBar/index';
import MessageBox from '../MessageBox';
import ProductsContainer from '../ProductsContainer';
import Preloader from '../Preloader';
import UserBar from '../UserBar';
import { getFetchStatus, getItems } from '../../selectors';
import { StatusType, MessageType } from '../../common/enums';
import { StatusPropType } from '../../common/propTypes';
import { fetchItems } from './actions';

class App extends Component {
  state = {
    ordersHistoryOrder: false,
    productsListOrder: false
  };

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    const { fetchItems } = this.props;
    fetchItems();
  };

  handleSort = (order, selectedOption) => {
    console.log(order, selectedOption);
  };

  render() {
    const { fetchStatus, items } = this.props;
    const reversedItems = items.reverse();
    const archiveList = reversedItems.filter(item => item.isOrdered);
    const shoppingList = reversedItems.filter(item => !item.isOrdered);

    return (
      <div
        className={classNames('app-wrapper', {
          overlay: fetchStatus === StatusType.PENDING
        })}
      >
        <UserBar />
        <Header />
        {fetchStatus === StatusType.ERROR && (
          <MessageBox
            message="Fetching failed. Try to refresh the page."
            type={MessageType.ERROR}
          />
        )}
        <InputBar />
        <ProductsContainer
          handleSort={this.handleSort}
          products={shoppingList}
        />
        <ProductsContainer
          handleSort={this.handleSort}
          archived
          products={archiveList}
        />
        <Footer />
        {fetchStatus === StatusType.PENDING && (
          <Preloader message="Fetching data..." />
        )}
      </div>
    );
  }
}

App.propTypes = {
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
)(App);
