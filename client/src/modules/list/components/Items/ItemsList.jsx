import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import ListItem from 'modules/list/components/Items/ListItem';

const DISPLAY_LIMIT = 3;

class ItemsList extends PureComponent {
  state = {
    limit: DISPLAY_LIMIT
  };

  showMore = () => {
    this.setState(({ limit }) => ({ limit: limit + DISPLAY_LIMIT }));
  };

  render() {
    const { isMember, items } = this.props;
    const { limit } = this.state;

    return (
      <Fragment>
        {!items.length ? (
          <div className="items__message">
            <p>There are no items!</p>
          </div>
        ) : (
          <ul className="items-list">
            {items.slice(0, limit).map(item => (
              <ListItem data={item} isMember={isMember} key={item._id} />
            ))}
          </ul>
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
  isMember: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.object)
};

export default ItemsList;
