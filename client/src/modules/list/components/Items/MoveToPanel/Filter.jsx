import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
    this.input.focus();
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
    // this.setState({ visibleElements: filteredElements });
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

    return (
      <div className="filter-lists">
        <input
          className="filter-input"
          placeholder="Filter lists"
          type="text"
          name="filter"
          value={query}
          onChange={this.handleInputChange}
          ref={this.input}
        />
        <button
          className="filter-reset"
          onClick={this.resetFilter}
          title="reset filter"
          type="button"
        >
          reset
        </button>
      </div>
    );
  }
}

Filter.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string })
  ).isRequired,

  onFilter: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  activePark: state.activePark,
  visibleParks: state.visibleParks,
  isPanelVisibleOnMobile: state.isPanelVisibleOnMobile
});

const mapDispatchToProps = dispatch => ({
  setActivePark: activePark => {
    dispatch({ type: 'SET_ACTIVE_PARK', activePark: activePark });
  },
  setVisibleParks: visibleParks => {
    dispatch({ type: 'SET_VISIBLE_PARKS', visibleParks });
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filter);
