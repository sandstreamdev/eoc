import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _trim from 'lodash/trim';

import { SearchIcon } from 'assets/images/icons';
import './Filter.scss';

class Filter extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };
    this.debouncedFilter = _debounce(this.handleFilterChange, 500);
    this.input = React.createRef();
  }

  componentDidMount() {
    const { autofocus } = this.props;

    if (autofocus) {
      this.input.current.focus();
    }
  }

  componentWillUnmount() {
    this.debouncedFilter.cancel();
  }

  filterByFields = query => {
    const { fields, options } = this.props;
    const normalizedQuery = query.toLowerCase();

    return options.filter(option => {
      let testString = '';

      fields.forEach(field => {
        if (option[field]) {
          testString += option[field];
        }
      });

      return testString.toLowerCase().includes(normalizedQuery);
    });
  };

  handleFilterChange = query => {
    const { onFilter, options } = this.props;
    const trimmedQuery = _trim(query);
    let filteredOptions;

    if (query) {
      filteredOptions = this.filterByFields(trimmedQuery);
    } else {
      filteredOptions = options;
    }

    onFilter(filteredOptions);
  };

  resetFilter = () => {
    const { options, onFilter } = this.props;

    this.setState({ query: '' }, () => onFilter(options));
  };

  handleInputChange = event => {
    const { value } = event.target;

    this.setState({ query: value }, () => this.debouncedFilter(value));
  };

  render() {
    const { query } = this.state;
    const {
      buttonContent,
      clearButtonLabel,
      clearFilterButton,
      placeholder
    } = this.props;
    const isClearButtonVisible = clearFilterButton && buttonContent && query;

    return (
      <div className="filter">
        <SearchIcon label={placeholder} />
        <input
          name="filter"
          onChange={this.handleInputChange}
          placeholder={placeholder || ''}
          ref={this.input}
          type="text"
          value={query}
        />
        {isClearButtonVisible && (
          <button
            onClick={this.resetFilter}
            title={clearButtonLabel}
            type="button"
          >
            {buttonContent}
          </button>
        )}
      </div>
    );
  }
}

Filter.defaultProps = {
  clearFilterButton: true
};

Filter.propTypes = {
  autofocus: PropTypes.bool,
  buttonContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  clearButtonLabel: PropTypes.string,
  clearFilterButton: PropTypes.bool,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  placeholder: PropTypes.string,

  onFilter: PropTypes.func.isRequired
};

export default Filter;
