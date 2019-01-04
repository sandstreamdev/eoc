import React, { Component } from 'react';

class SortBox extends Component {
  constructor(props) {
    super(props);

    this.selectField = React.createRef();
    console.log(this.selectField.current);

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

  handleSelect = e => {
    this.setState({
      selectedOption: e.target.value
    });
  };

  handleOrder = () => {
    const { order, selectedOption } = this.state;
    const { handleSort } = this.props;

    this.setState(
      {
        order: !this.state.order
      },
      handleSort(order, selectedOption)
    );
  };

  render() {
    const { selectedOption } = this.state;
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
          <option value="author">Author</option>
          <option value="date">Date</option>
          <option value="name">Name</option>
        </select>
        <div className="sort-box__controllers">
          <a
            className="sort-box__button"
            type="button"
            href="#!"
            onClick={this.handleOrder}
          >
            <svg
              aria-hidden="true"
              data-prefix="fas"
              data-icon="chevron-up"
              className="svg-inline--fa fa-chevron-up fa-w-14 sort-box__arrow-1"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="#8a949e"
                d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"
              />
            </svg>
            <svg
              aria-hidden="true"
              data-prefix="fas"
              data-icon="chevron-down"
              className="svg-inline--fa fa-chevron-down fa-w-14 sort-box__arrow-2"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="#8a949e"
                d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
              />
            </svg>
          </a>
        </div>
      </div>
    );
  }
}

export default SortBox;
