import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _sortBy from 'lodash/sortBy';
import { injectIntl, FormattedMessage } from 'react-intl';
import _flowRight from 'lodash/flowRight';
import _isEqual from 'lodash/isEqual';

import ItemsList from 'modules/list/components/Items';
import { getCurrentUser } from 'modules/user/model/selectors';
import { IntlPropType } from 'common/constants/propTypes';
import './ItemsContainer.scss';
import Filter from 'common/components/Filter';
import { CloseIcon } from 'assets/images/icons';

// FIXME: Remove sortbox and filterBox components and styles files

class ItemsContainer extends Component {
  constructor(props) {
    super(props);

    const { items } = this.props;

    this.state = {
      items
    };
  }

  componentDidUpdate(prevProps) {
    const { items } = this.props;
    const { items: prevItems } = prevProps;

    if (!_isEqual(items, prevItems)) {
      this.setState({ items });
    }
  }

  handleFilterLists = itemsToDisplay =>
    this.setState({ items: itemsToDisplay });

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
      items: itemsToSearch
    } = this.props;
    const { items } = this.state;

    return (
      <div className="items">
        <header className="items__header">
          <h2 className="items__heading items__heading--left">
            {this.renderHeadingText()}
          </h2>
          <div className="items__header-controls">
            <Filter
              buttonContent={<CloseIcon />}
              classes="items__filter"
              onFilter={this.handleFilterLists}
              options={itemsToSearch}
              // TODO: add fields options for sorting
              // fields={[name, authorName]}
              placeholder={formatMessage({
                id: 'list.list-item.input-find-items'
              })}
            />
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
  done: PropTypes.bool,
  intl: IntlPropType.isRequired,
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object)
};

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state)
});

export default _flowRight(injectIntl, connect(mapStateToProps))(ItemsContainer);
