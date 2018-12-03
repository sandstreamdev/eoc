import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as itemsActions from './_actions/itemsActions';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductsContainer from './components/ProductsContainer';
import Footer from './components/Footer';

class App extends Component {
  componentDidMount() {
    const {
      itemsActions: { fetchItems }
    } = this.props;
    fetchItems();
  }

  render() {
    const { archiveList, shoppingList } = this.props;
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
  itemsActions: PropTypes.shape({ fetchItems: PropTypes.func }),
  archiveList: PropTypes.arrayOf(PropTypes.object),
  shoppingList: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = state => ({
  shoppingList: state.items.shoppingList,
  archiveList: state.items.archiveList
});

const mapDispatchToProps = dispatch => ({
  itemsActions: bindActionCreators(itemsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
