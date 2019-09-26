import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _debounce from 'lodash/debounce';
import _trimStart from 'lodash/trimStart';

class Filter extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };
    this.debouncedFilter = _debounce(this.handleFilter, 500);
    this.input = React.createRef();
  }

  componentDidMount() {
    this.input.current.focus();
  }

  componentWillUnmount() {
    this.debouncedFilter.cancel();
  }

  filterByFields = query => {
    const { options, fields } = this.props;
    const match = new RegExp(query, 'i');

    return options.filter(option => {
      let testString = '';

      fields.forEach(field => {
        if (option[field]) {
          testString += option[field];
        }
      });

      return match.test(testString);
    });
  };

  handleFilter = query => {
    const { options, onFilter } = this.props;
    let filteredOptions;

    if (query) {
      filteredOptions = this.filterByFields(query);
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
    const query = _trimStart(value);

    this.setState(() => ({ query }), this.handleFilterOptions);
  };

  handleFilterOptions = () => {
    const { query } = this.state;

    this.debouncedFilter(query);
  };

  render() {
    const { query } = this.state;
    const {
      buttonContent,
      classes,
      clearFilterButton,
      placeholder
    } = this.props;

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
        {clearFilterButton && buttonContent && (
          <button onClick={this.resetFilter} title="reset filter" type="button">
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
  buttonContent: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  classes: PropTypes.string.isRequired,
  clearFilterButton: PropTypes.bool,
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  placeholder: PropTypes.string,

  onFilter: PropTypes.func.isRequired
};

export default Filter;
