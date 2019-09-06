import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _flowRight from 'lodash/flowRight';

import Filter from './Filter';
import { fetchListsForItem } from 'modules/list/model/actions';
import { getListsForItem } from 'modules/list/model/selectors';
import { RouterMatchPropType } from 'common/constants/propTypes';
import Preloader from 'common/components/Preloader';

class MoveToPanel extends PureComponent {
  state = {
    listsToDisplay: [],
    pending: false
  };

  componentDidMount() {
    const {
      fetchListsForItem,
      match: {
        params: { id }
      }
    } = this.props;

    this.setState({ pending: true });

    fetchListsForItem(id).finally(() => this.setState({ pending: false }));
  }

  handleFilterLists = listsToDisplay => this.setState({ listsToDisplay });

  render() {
    const { listsToDisplay, pending } = this.state;
    const { lists } = this.props;

    return (
      <div>
        <Filter elements={lists} onFilter={this.handleFilterLists} />
        <div>
          {pending ? (
            <Preloader />
          ) : (
            <ul>
              {listsToDisplay.map(list => (
                <li key={list.id}>
                  <button type="button" disable={pending}>
                    {list.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }
}

MoveToPanel.propTypes = {
  lists: PropTypes.arrayOf(
    PropTypes.shape({ _id: PropTypes.string, name: PropTypes.string })
  ).isRequired,
  match: RouterMatchPropType.isRequired,

  fetchListsForItem: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;

  return {
    lists: getListsForItem(state, id)
  };
};

export default _flowRight(
  withRouter,
  connect(
    mapStateToProps,
    { fetchListsForItem }
  )
)(MoveToPanel);
