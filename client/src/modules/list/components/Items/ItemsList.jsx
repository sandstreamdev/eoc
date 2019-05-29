import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import ListItem from 'modules/list/components/Items/ListItem';
import ListArchivedItem from 'modules/list/components/Items/ListArchivedItem';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';

const DISPLAY_LIMIT = 3;

class ItemsList extends PureComponent {
  state = {
    limit: DISPLAY_LIMIT
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  renderItems = () => {
    const { archived, isMember, items } = this.props;
    const { limit } = this.state;

    return archived ? (
      <ul className="items-list">
        {items.slice(0, limit).map(item => (
          <ListArchivedItem data={item} key={item._id} />
        ))}
      </ul>
    ) : (
      <ul className="items-list">
        {items.slice(0, limit).map(item => (
          <ListItem data={item} isMember={isMember} key={item._id} />
        ))}
      </ul>
    );
  };

  render() {
    const { archived, items } = this.props;
    const { limit } = this.state;

    return (
      <Fragment>
        {!items.length ? (
          <MessageBox
            message={`There are no ${archived ? 'archived ' : ''}items!`}
            type={MessageType.INFO}
          />
        ) : (
          this.renderItems()
        )}
        {limit < items.length && (
          <button
            className="items__show-more"
            onClick={this.showMore}
            type="button"
          />
        )}
      </Fragment>
    );
  }
}

ItemsList.propTypes = {
  archived: PropTypes.bool,
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object)
};

export default ItemsList;
