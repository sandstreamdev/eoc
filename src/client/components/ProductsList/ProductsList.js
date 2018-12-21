import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ProductsListItem from '../ProductsListItem';
import toggle from './actions';

const DISPLAY_LIMIT = 3;

class ProductsList extends Component {
  state = {
    limit: DISPLAY_LIMIT
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  toggleItem = (id, isOrdered) => {
    const { toggle } = this.props;
    toggle(id, isOrdered);
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
  products: PropTypes.arrayOf(PropTypes.object),

  toggle: PropTypes.func
};

export default connect(
  null,
  { toggle }
)(ProductsList);
