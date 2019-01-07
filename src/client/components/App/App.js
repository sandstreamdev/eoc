import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Footer from '../Footer';
import Header from '../Header';
import InputBar from '../InputBar/index';
import MessageBox from '../MessageBox';
import ProductsContainer from '../ProductsContainer';
import Preloader from '../Preloader';
import UserBar from '../UserBar';
import { getFetchStatus, getItems } from '../../selectors';
import { StatusType, MessageType } from '../../common/enums';
import { StatusPropType } from '../../common/propTypes';
import { fetchItems } from './actions';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ordersHistoryOrder: false,
      productsListOrder: false,
      items: this.props.items
    };
  }

  componentWillMount() {
    this.fetchItems();
  }

  // componentDidUpdate(prevProps) {
  //   const { items } = this.props;
  //   const reversedItems = items.reverse();

  //   if (items !== prevProps.items) {
  //     this.setState({
  //       items: reversedItems
  //     });
  //   }
  // }

  fetchItems = () => {
    const { fetchItems } = this.props;
    fetchItems();
  };

  handleSort = (order, selectedOption) => {
    if (order) {
      switch (selectedOption) {
        case 'author':
          console.log('ascending by author');
          break;
        case 'date':
          console.log('ascending by date');
          break;
        case 'name':
          console.log('ascending by name');
          break;
        default:
          console.log('ascending by default');
      }
    } else {
      switch (selectedOption) {
        case 'author':
          console.log('descending by author');
          break;
        case 'date':
          console.log('descending by date');
          break;
        case 'name':
          console.log('descending by name');
          break;
        default:
          console.log('descending by default');
      }
    }
  };

  render() {
    const { fetchStatus, items } = this.props;
    const reversedItems = items.reverse();
    const archiveList = reversedItems.filter(item => item.isOrdered);
    const shoppingList = reversedItems.filter(item => !item.isOrdered);

    return (
      <div
        className={classNames('app-wrapper', {
          overlay: fetchStatus === StatusType.PENDING
        })}
      >
        <UserBar />
        <Header />
        {fetchStatus === StatusType.ERROR && (
          <MessageBox
            message="Fetching failed. Try to refresh the page."
            type={MessageType.ERROR}
          />
        )}
        <InputBar />
        <ProductsContainer
          handleSort={this.handleSort}
          products={shoppingList}
        />
        <ProductsContainer
          handleSort={this.handleSort}
          archived
          products={archiveList}
        />
        <Footer />
        {fetchStatus === StatusType.PENDING && (
          <Preloader message="Fetching data..." />
        )}
      </div>
    );
  }
}

App.propTypes = {
  fetchStatus: StatusPropType.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),

  fetchItems: PropTypes.func
};

const mapStateToProps = state => ({
  fetchStatus: getFetchStatus(state),
  items: getItems(state)
});

export default connect(
  mapStateToProps,
  { fetchItems }
)(App);
