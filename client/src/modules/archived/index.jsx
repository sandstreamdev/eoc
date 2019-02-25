import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _map from 'lodash/map';

import Toolbar from 'common/components/Toolbar';
import { fetchShoppingListsMetaData } from 'modules/shopping-list/model/actions';
import { getShoppingLists } from 'modules/shopping-list/model/selectors';
import CardItem from '../dashboard/CardItem';
import { ListIcon } from 'assets/images/icons';

class Archived extends PureComponent {
  componentDidMount() {
    const { fetchShoppingListsMetaData } = this.props;

    fetchShoppingListsMetaData('archived');
  }

  render() {
    const { lists } = this.props;

    return (
      <Fragment>
        <Toolbar />
        <div className="wrapper">
          <div className="archived">
            <h2 className="archived__heading">
              <ListIcon />
              Lists
            </h2>
            <ul className="archived__list">
              {_map(lists, item => (
                <li className="archived__list-item" key={item._id}>
                  <Link to={`list/${item._id}`}>
                    <CardItem name={item.name} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Fragment>
    );
  }
}

Archived.propTypes = {
  lists: PropTypes.objectOf(PropTypes.object),

  fetchShoppingListsMetaData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lists: getShoppingLists(state)
});

export default connect(
  mapStateToProps,
  { fetchShoppingListsMetaData }
)(Archived);
