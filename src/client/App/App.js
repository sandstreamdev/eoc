import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as itemsActions from './actions';
import Header from '../components/Header';
import { SearchBar } from '../components/SearchBar/index';
import ProductsContainer from '../components/ProductsContainer';
import Footer from '../components/Footer';

class App extends Component {
  state = {
    items: []
  };

  componentWillMount() {
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
    console.log(items);
    // const archiveList = items.filter(item => item.isOrdered);
    // const shoppingList = items.filter(item => !item.isOrdered).reverse();
    return (
      <div className="app-wrapper">
        <Header />
        <SearchBar />
        <ProductsContainer products={[1, 2]} />
        <ProductsContainer isArchive products={[1, 2]} />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object)
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
