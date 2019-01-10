import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ArrowIcon from '../assets/images/arrow-up-solid.svg';

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
    const { sort } = this.props;

    this.setState(
      {
        order: !order
      },
      sort(selectedOption, order)
    );
  };

  handleSelect = e => {
    const { order, selectedOption } = this.state;
    const { sort } = this.props;

    this.setState(
      {
        selectedOption: e.target.value
      },
      sort(selectedOption, order)
    );
  };

  render() {
    const { selectedOption, order } = this.state;
    const { label, options } = this.props;
    return (
      <div className="sort-box">
        <span className="sort-box__desc">{label}</span>
        <select
          className="sort-box__select"
          onBlur={this.handleSelect}
          onChange={this.handleSelect}
          ref={this.selectField}
          value={selectedOption}
        >
          {options.map(option => (
            <option key={option.label} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="sort-box__controllers">
          <button
            className={classNames('sort-box__button', {
              'sort-box__button--obverse': order
            })}
            onClick={this.handleOrder}
            type="button"
          >
            <img alt="Arrow icon" src={ArrowIcon} />
          </button>
        </div>
      </div>
    );
  }
}

SortBox.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.object),
  sort: PropTypes.func.isRequired
};

export default SortBox;
