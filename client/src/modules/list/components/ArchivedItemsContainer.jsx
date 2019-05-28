import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import ItemsContainer from 'modules/list/components/ItemsContainer';
import { getArchivedItems } from 'modules/list/model/selectors';
import {
  fetchArchivedItems,
  removeArchivedItems
} from 'modules/list/components/Items/model/actions';
import { RouterMatchPropType } from 'common/constants/propTypes';
import Preloader from 'common/components/Preloader';

class ArchivedItemsContainer extends PureComponent {
  state = {
    areArchivedItemsVisible: false,
    pendingForArchivedItems: false
  };

  componentDidMount() {}

  handleArchivedItemsVisibility = () =>
    this.setState(
      ({ areArchivedItemsVisible }) => ({
        areArchivedItemsVisible: !areArchivedItemsVisible
      }),
      () => this.handleArchivedItemsData()
    );

  handleArchivedItemsData = () => {
    const { areArchivedItemsVisible } = this.state;
    const {
      fetchArchivedItems,
      match: {
        params: { id }
      },
      removeArchivedItems
    } = this.props;

    if (areArchivedItemsVisible) {
      this.setState({ pendingForArchivedItems: true });

      fetchArchivedItems(id).finally(() =>
        this.setState({ pendingForArchivedItems: false })
      );
    } else {
      removeArchivedItems(id);
    }
  };

  render() {
    const { areArchivedItemsVisible, pendingForArchivedItems } = this.state;
    const { archivedItems, isMember } = this.props;

    return (
      <div className="archived-items">
        <button
          className="link-button"
          onClick={this.handleArchivedItemsVisibility}
          type="button"
        >
          {` ${areArchivedItemsVisible ? 'hide' : 'show'} archived items`}
        </button>
        {areArchivedItemsVisible && (
          <div
            className={classNames('archived-items__items', {
              'archived-items__items--visible': areArchivedItemsVisible
            })}
          >
            <ItemsContainer
              archived
              isMember={isMember}
              items={archivedItems}
            />
            {pendingForArchivedItems && <Preloader />}
          </div>
        )}
      </div>
    );
  }
}

ArchivedItemsContainer.propTypes = {
  archivedItems: PropTypes.arrayOf(PropTypes.object),
  isMember: PropTypes.bool,
  match: RouterMatchPropType.isRequired,

  fetchArchivedItems: PropTypes.func.isRequired,
  removeArchivedItems: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const {
    match: {
      params: { id }
    }
  } = ownProps;

  return {
    archivedItems: getArchivedItems(state, id)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      fetchArchivedItems,
      removeArchivedItems
    }
  )(ArchivedItemsContainer)
);
