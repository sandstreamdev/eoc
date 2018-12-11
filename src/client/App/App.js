import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as itemsActions from './actions';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar/index';
import ProductsContainer from '../components/ProductsContainer';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import MessageBox from '../components/MessageBox';

class App extends Component {
  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    const {
      itemsActions: { fetchItems }
    } = this.props;
    fetchItems();
  };

  render() {
    const { items, fetchStatus } = this.props;
    const archiveList = items.filter(item => item.isOrdered).reverse();
    const shoppingList = items.filter(item => !item.isOrdered).reverse();

    return (
      <div
        className={classNames('app-wrapper', {
          overlay: fetchStatus === 'true'
        })}
      >
        <Header />
        {fetchStatus === 'error' && (
          <MessageBox
            message="Fetching failed. Try to refresh the page."
            type="error"
          />
        )}

        <SearchBar />
        <ProductsContainer products={shoppingList} />
        <ProductsContainer isArchive products={archiveList} />
        <Footer />
        {fetchStatus === 'true' && <Preloader message="Fetching data..." />}
      </div>
    );
  }
}

App.propTypes = {
  fetchStatus: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.object),
  itemsActions: PropTypes.objectOf(PropTypes.func)
};

const mapStateToProps = state => ({
  items: state.items,
  fetchStatus: state.uiStatus.fetchStatus
});

const mapDispatchToProps = dispatch => ({
  itemsActions: bindActionCreators(itemsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
