import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Toolbar from 'common/components/Toolbar';
import { fetchArchivedListsMetaData } from 'modules/shopping-list/model/actions';
import { getShoppingLists } from 'modules/shopping-list/model/selectors';
import { ListIcon } from 'assets/images/icons';
import GridList from 'common/components/GridList';

class Archived extends PureComponent {
  componentDidMount() {
    const { fetchArchivedListsMetaData } = this.props;

    fetchArchivedListsMetaData();
  }

  render() {
    const { lists } = this.props;

    return (
      <Fragment>
        <Toolbar />
        <div className="wrapper">
          <GridList
            icon={<ListIcon />}
            items={lists}
            name="Archived Lists"
            placeholder="There are no archived lists!"
          />
          <GridList
            icon={<ListIcon />}
            name="Archived Cohorts"
            placeholder="There are no archived cohorts!"
          />
        </div>
      </Fragment>
    );
  }
}

Archived.propTypes = {
  lists: PropTypes.objectOf(PropTypes.object),

  fetchArchivedListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  { fetchArchivedListsMetaData }
)(Archived);
