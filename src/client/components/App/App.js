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
