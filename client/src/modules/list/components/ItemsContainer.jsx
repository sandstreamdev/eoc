import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';

import ItemsList from 'modules/list/components/Items';
import { getCurrentUser } from 'modules/user/model/selectors';
import { IntlPropType, UserPropType } from 'common/constants/propTypes';
import './ItemsContainer.scss';

// FIXME: Remove sortbox and filterBox components and styles files

class ItemsContainer extends Component {
  state = {
    // sortBy: SortOptionType.DATE,
    // sortOrder: SortOrderType.DESCENDING
    // filterBy: FilterOptionType.ALL_ITEMS
  };

  renderHeadingText = () => {
    const { archived, done } = this.props;

    if (archived) {
      return <FormattedMessage id="list.items-container.arch-items" />;
    }

    return (
      <FormattedMessage
        id={
          done ? 'list.items-container.done' : 'list.items-container.unhandled'
        }
      />
    );
  };

  render() {
    const {
      archived,
      children,
      done,
      intl: { formatMessage },
      isMember,
      items
    } = this.props;

    return (
      <div className="items">
        <header className="items__header">
          <h2 className="items__heading items__heading--left">
            {this.renderHeadingText()}
          </h2>
          <div className="items__header-controls">
            {/*TODO: Search box here*/}
          </div>
        </header>
        {children}
        <div className="items__body">
          <ItemsList
            archived={archived}
            done={done}
            isMember={isMember}
            items={items}
          />
        </div>
      </div>
    );
  }
}

ItemsContainer.propTypes = {
  archived: PropTypes.bool,
  children: PropTypes.node,
  // currentUser: UserPropType.isRequired,
  done: PropTypes.bool,
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(injectIntl, connect(mapStateToProps))(ItemsContainer);
