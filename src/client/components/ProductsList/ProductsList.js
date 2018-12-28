import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProductsListItem from '../ProductsListItem';
import { getCurrentUser } from '../../selectors';
import toggle from './actions';

const DISPLAY_LIMIT = 3;

class ProductsList extends Component {
  state = {
    limit: DISPLAY_LIMIT
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  toggleItem = (author, id, isOrdered) => {
    const { toggle } = this.props;
    const {
      currentUser: { name }
    } = this.props;

    /**
     * If an item was ordered, check item author
     * and update author if neccessary to point
     * who is ordering this time.
     */
    !isOrdered
      ? toggle(id, isOrdered)
      : author !== name
      ? toggle(id, isOrdered, name)
      : toggle(id, isOrdered);
  };

  render() {
    const { archived, products } = this.props;
    const { limit } = this.state;
    return (
      <Fragment>
        {!products.length ? (
          <div className="products__message">
            <p>There are no items!</p>
          </div>
        ) : (
          <ul className="products-list">
            {products.slice(0, limit).map(item => (
              <ProductsListItem
                archived={archived}
                author={item.author}
                id={item._id}
                image={item.image}
                key={item._id}
                name={item.name}
                toggleItem={this.toggleItem}
              />
            ))}
          </ul>
        )}
        {limit < products.length && (
          <button
            className="products__show-more"
            onClick={this.showMore}
            type="button"
          />
        )}
      </Fragment>
    );
  }
}

ProductsList.propTypes = {
  archived: PropTypes.bool,
  currentUser: PropTypes.objectOf(PropTypes.string),
  products: PropTypes.arrayOf(PropTypes.object),

  toggle: PropTypes.func
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  { toggle }
)(ProductsList);
