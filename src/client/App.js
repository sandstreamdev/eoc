import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as itemsActions from './components/ProductsList/actions';
import Header from './components/Header';
import { SearchBar } from './components/SearchBar/index';
import ProductsContainer from './components/ProductsContainer';
import Footer from './components/Footer';

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
    const { archiveList, shoppingList } = this.props;
    return (
      <div className="app-wrapper">
        <Header />
        <SearchBar />
        <ProductsContainer products={shoppingList} />
        <ProductsContainer archived products={archiveList} />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  archiveList: PropTypes.arrayOf(PropTypes.object),
  itemsActions: PropTypes.shape({ fetchItems: PropTypes.func }),
  shoppingList: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = state => ({
  archiveList: state.items.archiveList,
  shoppingList: state.items.shoppingList
});

const mapDispatchToProps = dispatch => ({
  itemsActions: bindActionCreators(itemsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
