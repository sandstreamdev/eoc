import React, { Component } from 'react';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductsContainer from './components/ProductsContainer';
import Footer from './components/Footer';

class App extends Component {
  state = {
    shoopingList: [
      {
        id: 1,
        name: 'Super coffee',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 2,
        name: 'Green cucumber',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 3,
        name: 'Toilet paper',
        image: 'src/client/assets/images/placeholder.png'
      }
    ],
    archiveList: [
      {
        id: 4,
        name: 'Window cleaner',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 5,
        name: 'Pencils',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 6,
        name: 'Paper sheets A5 format',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 7,
        name: 'Lorem ipsum',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 8,
        name: 'Lorem ipsumm',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 9,
        name: 'Lorem ipsums',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 10,
        name: 'Lorem ipsuma',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 11,
        name: 'Lorem ipsumsa',
        image: 'src/client/assets/images/placeholder.png'
      },
      {
        id: 12,
        name: 'Lorem ipsumasa',
        image: 'src/client/assets/images/placeholder.png'
      }
    ]
  };

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
