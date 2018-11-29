import React, { Component } from 'react';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductsContainer from './components/ProductsContainer';
import Footer from './components/Footer';
import initialData from './common/initialData.json';

class App extends Component {
  state = initialData;

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

export default App;
