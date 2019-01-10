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
      order: false
    };
  }

  componentDidMount() {
    this.setState({
      selectedOption: this.selectField.current.value
    });
  }

  render() {
    const { label, onChange, options } = this.props;
    const { order, selectedOption } = this.state;

    return (
      <div className="sort-box">
        <span className="sort-box__desc">{label}</span>
        <select
          className="sort-box__select"
          onChange={e =>
            this.setState(
              { selectedOption: e.target.value },
              onChange(selectedOption, order)
            )
          }
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
            onClick={() =>
              this.setState({ order: !order }, onChange(selectedOption, order))
            }
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

  onChange: PropTypes.func.isRequired
};

export default SortBox;
