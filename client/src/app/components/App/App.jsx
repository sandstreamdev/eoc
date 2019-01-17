import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import Footer from 'app/components/Footer/Footer';
import MessageBox from 'common/components/MessageBox';
import ProductsContainer from 'modules/shopping-list/ProductsContainer';
import Preloader from 'common/components/Preloader';
import { StatusType, MessageType } from 'common/constants/enums';
import { getItems, getFetchStatus } from 'common/selectors';
import InputBar from 'modules/shopping-list/InputBar';
import { StatusPropType } from 'common/constants/propTypes';
import { fetchItems } from 'modules/legacy/appActions';
import Toolbar from '../Toolbar/Toolbar';

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
    const reversedItem = [...items].reverse();
    const archiveList = reversedItem.filter(item => item.isOrdered);
    const shoppingList = reversedItem.filter(item => !item.isOrdered);

    return (
      <Fragment>
        <Toolbar />
        <div
          className={classNames('app-wrapper', {
            overlay: fetchStatus === StatusType.PENDING
          })}
        >
          {fetchStatus === StatusType.ERROR && (
            <MessageBox
              message="Fetching failed. Try to refresh the page."
              type={MessageType.ERROR}
            />
          )}
          <InputBar />
          <ProductsContainer products={shoppingList} />
          <ProductsContainer archived products={archiveList} />
          <Footer />
          {fetchStatus === StatusType.PENDING && (
            <Preloader message="Fetching data..." />
          )}
        </div>
      </Fragment>
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
