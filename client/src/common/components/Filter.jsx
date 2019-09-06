import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _trim from 'lodash/trim';

class Filter extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };
    this.debouncedFilter = _debounce(this.filter, 500);
    this.input = React.createRef();
  }

  componentDidMount() {
    this.input.current.focus();
  }

  componentWillUnmount() {
    this.debouncedFilter.cancel();
  }

  filter = query => {
    const { elements, onFilter } = this.props;
    let filteredElements;

    if (query) {
      const match = new RegExp(query, 'i');
      filteredElements = elements.filter(el => match.test(el.name));
    } else {
      filteredElements = elements;
    }

    onFilter(filteredElements);
  };

  resetFilter = () => {
    const { elements, onFilter } = this.props;
    this.setState({ query: '' }, () => onFilter(elements));
  };

  handleInputChange = event => {
    const { value } = event.target;
    const query = _trim(value);

    this.setState(() => ({ query }), this.handleFilterElements);
  };

  handleFilterElements = () => {
    const { query } = this.state;

    this.debouncedFilter(query);
  };

  render() {
    const { query } = this.state;
    const { buttonContent, classes, placeholder, resetButton } = this.props;

    return (
      <div className={classes}>
        <input
          name="filter"
          onChange={this.handleInputChange}
          placeholder={placeholder || ''}
          ref={this.input}
          type="text"
          value={query}
        />
        {resetButton && buttonContent && (
          <button onClick={this.resetFilter} title="reset filter" type="button">
            {buttonContent}
          </button>
        )}
      </div>
    );
  }
}

Filter.defaultProps = {
  resetButton: true
};

Filter.propTypes = {
  buttonContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  classes: PropTypes.string.isRequired,
  elements: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  placeholder: PropTypes.string,
  resetButton: PropTypes.bool,

  onFilter: PropTypes.func.isRequired
};

export default Filter;
