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
    const { options, onFilter } = this.props;
    let filteredOptions;

    if (query) {
      const match = new RegExp(query, 'i');

      // TODO: option.name || option.authorName
      filteredOptions = options.filter(option => match.test(option.name));
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
    const query = _trim(value);

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
  options: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  placeholder: PropTypes.string,

  onFilter: PropTypes.func.isRequired
};

export default Filter;
