import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as itemsActions from './actions';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar/index';
import ProductsContainer from '../components/ProductsContainer';
import Footer from '../components/Footer';

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
    const { items } = this.props;
    const archiveList = items.filter(item => item.isOrdered).reverse();
    const shoppingList = items.filter(item => !item.isOrdered).reverse();

    return (
      <div className="app-wrapper">
        <Header />
        <SearchBar />
        <ProductsContainer products={shoppingList} />
        <ProductsContainer isArchive products={archiveList} />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  itemsActions: PropTypes.objectOf(PropTypes.func)
};

const mapStateToProps = state => ({
  addItemSuccess: state.addItemSuccess,
  items: state.items
});

const mapDispatchToProps = dispatch => ({
  itemsActions: bindActionCreators(itemsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
