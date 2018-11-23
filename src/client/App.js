import React from 'react';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductsList from './components/ProductsList';

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <SearchBar />
      <ProductsList />
    </div>
  );
}

export default App;
