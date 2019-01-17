import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Footer from 'modules/legacy/Footer';
import Header from 'modules/legacy/Header';
import MessageBox from 'modules/legacy/MessageBox';
import ProductsContainer from 'modules/legacy/ProductsContainer';
import Preloader from 'modules/legacy/Preloader';
import { StatusType, MessageType } from 'common/constants/enums';
import { getItems, getFetchStatus } from 'modules/legacy/selectors';
import InputBar from 'modules/legacy/InputBar';
import UserBar from 'modules/legacy/UserBar';
import { StatusPropType } from 'common/constants/propTypes';
import { fetchItems } from 'modules/legacy/appActions';

class App extends Component {
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
        <ProductsContainer products={shoppingList} />
        <ProductsContainer archived products={archiveList} />
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
