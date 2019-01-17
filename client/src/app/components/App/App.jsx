import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import AuthBox from 'modules/auth-box';
import Footer from 'app/components/Footer/Footer';
import MessageBox from 'common/components/MessageBox';
import ProductsContainer from 'modules/shopping-list/ProductsContainer';
import Preloader from 'common/components/Preloader';
import { StatusType, MessageType } from 'common/constants/enums';
import { getItems, getFetchStatus, getCurrentUser } from 'common/selectors';
import InputBar from 'modules/shopping-list/InputBar';
import { StatusPropType, UserPropType } from 'common/constants/propTypes';
import { fetchItems } from 'modules/legacy/appActions';
import Toolbar from '../Toolbar/Toolbar';
import { setCurrentUser } from 'modules/legacy/mainActions';

class App extends Component {
  componentDidMount() {
    this.fetchItems();
    this.setAuthenticationState();
  }

  fetchItems = () => {
    const { fetchItems } = this.props;
    fetchItems();
  };

  setAuthenticationState = () => {
    const { setCurrentUser } = this.props;

    setCurrentUser();
  };

  render() {
    const { currentUser, fetchStatus, items } = this.props;
    const reversedItem = [...items].reverse();
    const archiveList = reversedItem.filter(item => item.isOrdered);
    const shoppingList = reversedItem.filter(item => !item.isOrdered);

    return currentUser ? (
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
    ) : (
      <AuthBox />
    );
  }
}

App.propTypes = {
  currentUser: UserPropType,
  fetchStatus: StatusPropType.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),

  fetchItems: PropTypes.func,
  setCurrentUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  fetchStatus: getFetchStatus(state),
  items: getItems(state)
});

export default connect(
  mapStateToProps,
  { fetchItems, setCurrentUser }
)(App);
