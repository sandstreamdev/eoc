import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import * as itemsActions from './_actions/itemsActions';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductsContainer from './components/ProductsContainer';
import Footer from './components/Footer';
import initialData from './common/initialData.json';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = initialData;
  }

  componentWillMount() {
    this.props.itemsActions.fetchItems();
  }

  render() {
    const { shoopingList, archiveList } = this.state;
    return (
      <div className="app-wrapper">
        <Header />
        <SearchBar />
        <ProductsContainer products={shoopingList} />
        <ProductsContainer isArchive products={archiveList} />
        <Footer />
      </div>
    );
  }
}

App.propTypes = {
  itemsActions: PropTypes.shape({ fetchItems: PropTypes.func })
};

const mapStateToProps = state => ({
  items: state.items
});

const mapDispatchToProps = dispatch => ({
  itemsActions: bindActionCreators(itemsActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
