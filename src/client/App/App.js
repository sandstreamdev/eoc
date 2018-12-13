import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { fetchItems } from './actions';
import Footer from '../components/Footer';
import Header from '../components/Header';
import MessageBox from '../components/MessageBox';
import ProductsContainer from '../components/ProductsContainer';
import Preloader from '../components/Preloader';
import InputBar from '../components/InputBar/index';

class App extends Component {
  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
    const { fetchItems } = this.props;

    fetchItems();
  };

  render() {
    const { fetchStatus, items } = this.props;
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

        <InputBar />
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
  fetchItems: PropTypes.func
};

const mapStateToProps = state => ({
  fetchStatus: state.uiStatus.fetchStatus,
  items: state.items
});

export default connect(
  mapStateToProps,
  { fetchItems }
)(App);
