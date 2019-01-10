import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { SortType } from '../common/enums';
import ArrowIcon from '../assets/images/arrow-up-solid';

class SortBox extends Component {
  constructor(props) {
    super(props);

    this.selectField = React.createRef();
    this.state = {
      selectedOption: '',
      order: true
    };
  }

  componentDidMount() {
    this.setState({
      selectedOption: this.selectField.current.value
    });
  }

  handleOrder = () => {
    const { order, selectedOption } = this.state;
    const { handleSort } = this.props;

    this.setState(
      {
        order: !order
      },
      handleSort(selectedOption, order)
    );
  };

  handleSelect = e => {
    const { handleSort } = this.props;
    const { order, selectedOption } = this.state;

    this.setState(
      {
        selectedOption: e.target.value
      },
      handleSort(selectedOption, order)
    );
  };

  render() {
    const { selectedOption, order } = this.state;

    return (
      <div className="sort-box">
        <span className="sort-box__desc">Sort by:</span>
        <select
          className="sort-box__select"
          onBlur={this.handleSelect}
          onChange={this.handleSelect}
          ref={this.selectField}
          value={selectedOption}
        >
          {/* All the option values should match the database model properties */}
          <option value="author">Author</option>
          <option value="createdAt">Date</option>
          <option value="name">Name</option>
        </select>
        <div className="sort-box__controllers">
          <button
            className={classNames('sort-box__button', {
              'sort-box__button--obverse': order
            })}
            onClick={this.handleOrder}
            type="button"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    );
  }
}

SortBox.propTypes = {
  handleSort: PropTypes.func.isRequired
};

export default SortBox;
