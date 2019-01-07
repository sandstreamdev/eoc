import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { SortType } from '../common/enums';

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

  handleSelect = e => {
    const { order, selectedOption } = this.state;
    const { handleSort, archived } = this.props;

    this.setState(
      {
        selectedOption: e.target.value
      },
      handleSort(order, selectedOption, archived)
    );
  };

  handleOrder = () => {
    const { order, selectedOption } = this.state;
    const { handleSort, archived } = this.props;

    this.setState(
      {
        order: !order
      },
      handleSort(order, selectedOption, archived)
    );
  };

  render() {
    const { selectedOption, order } = this.state;
    const direction = order ? SortType.ASCENDING : SortType.DESCENDING;

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
            className="sort-box__button"
            onClick={this.handleOrder}
            type="button"
          >
            <svg
              aria-hidden="true"
              className={classNames(
                'svg-inline--fa',
                'fa-chevron-up',
                'fa-w-14',
                'sort-box__arrow',
                {
                  'sort-box__arrow--highlighted':
                    direction === SortType.ASCENDING
                }
              )}
              data-prefix="fas"
              data-icon="chevron-up"
              role="img"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#8a949e"
                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"
              />
            </svg>
            <svg
              aria-hidden="true"
              className={classNames(
                'svg-inline--fa',
                'fa-chevron-down',
                'fa-w-14',
                'sort-box__arrow',
                {
                  'sort-box__arrow--highlighted':
                    direction === SortType.DESCENDING
                }
              )}
              // className="svg-inline--fa fa-chevron-down fa-w-14 sort-box__arrow"
              data-prefix="fas"
              data-icon="chevron-down"
              role="img"
              viewBox="0 0 448 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#8a949e"
                d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
}

SortBox.propTypes = {
  archived: PropTypes.bool,

  handleSort: PropTypes.func.isRequired
};

export default SortBox;
