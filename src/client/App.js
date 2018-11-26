import React, { Component } from 'react';

import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ProductsContainer from './components/ProductsContainer';
import Footer from './components/Footer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shoopingList: [
        {
          id: 1,
          name: 'Kawa tchibo',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 2,
          name: 'Ogórek zielony',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 3,
          name: 'Papier toaletowy Regina',
          image: 'https://via.placeholder.com/50'
        }
      ],
      archiveList: [
        {
          id: 4,
          name: 'Płyn do szyb',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 5,
          name: 'Długopisy',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 6,
          name: 'Zeszyty format A5',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 7,
          name: 'Lorem ipsum',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 8,
          name: 'Lorem ipsumm',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 9,
          name: 'Lorem ipsums',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 10,
          name: 'Lorem ipsuma',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 11,
          name: 'Lorem ipsumsa',
          image: 'https://via.placeholder.com/50'
        },
        {
          id: 12,
          name: 'Lorem ipsumasa',
          image: 'https://via.placeholder.com/50'
        }
      ]
    };
  }

  render() {
    const { shoopingList, archiveList } = this.state;
    return (
      <div className="app-wrapper">
        <Header />
        <SearchBar />
        <ProductsContainer
          products={shoopingList}
          isArchive={false}
          title="Lista produktów"
        />
        <ProductsContainer
          products={archiveList}
          isArchive
          title="Historia zamówień"
        />
        <Footer />
      </div>
    );
  }
}

export default App;
