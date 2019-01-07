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
import { ListType, StatusType, MessageType } from '../../common/enums';
import { StatusPropType } from '../../common/propTypes';
import { fetchItems } from './actions';
import { sortList } from '../../utils/sortLists';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      archiveList: [],
      shoppingList: []
    };
  }

  componentDidMount() {
    this.fetchItems();
  }

  componentDidUpdate(prevProps) {
    const { items } = this.props;
    const reversedItems = items.reverse();

    if (items !== prevProps.items) {
      this.setState({
        archiveList: reversedItems.filter(item => item.isOrdered),
        shoppingList: reversedItems.filter(item => !item.isOrdered)
      });
    }
  }

  fetchItems = () => {
    const { fetchItems } = this.props;
    fetchItems();
  };

  handleSort = (order, criteria, listType) => {
    const { archiveList, shoppingList } = this.state;

    if (listType === ListType.ARCHIVED) {
      this.setState({
        archiveList: sortList(archiveList, criteria, order)
      });
    } else if (listType === ListType.SHOPPING) {
      this.setState({
        shoppingList: sortList(shoppingList, criteria, order)
      });
    }
  };

  render() {
    const { fetchStatus } = this.props;
    const { archiveList, shoppingList } = this.state;

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
          archived
          handleSort={this.handleSort}
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
