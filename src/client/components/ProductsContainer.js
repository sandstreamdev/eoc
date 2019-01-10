import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ProductsList from './ProductsList';
import SortBox from './SortBox';
import { sortList } from '../utils/sortLists';
import { OptionType } from '../common/enums';

// FIXME: Where to place options in project stucture?
const options = [
  { id: OptionType.AUTHOR, label: 'author' },
  { id: OptionType.DATE, label: 'date' },
  { id: OptionType.NAME, label: 'name' }
];

class ProductsContainer extends Component {
  state = {
    key: '',
    order: ''
  };

  handleOptions = (key, order) => {
    this.setState({
      key,
      order
    });
  };

  render() {
    const { archived, products } = this.props;
    const { key, order } = this.state;
    const sortedList = sortList(products, key, order);

    return (
      <div className="products">
        <header className="products__header">
          <h2 className="products__heading">
            {archived ? 'Orders history' : 'Products list'}
          </h2>
          <SortBox
            label="Sort by:"
            options={options}
            sort={this.handleOptions}
          />
        </header>
        <ProductsList archived={archived} products={sortedList} />
      </div>
    );
  }
}

ProductsContainer.propTypes = {
  archived: PropTypes.bool,
  products: PropTypes.arrayOf(PropTypes.object)
};

export default ProductsContainer;
