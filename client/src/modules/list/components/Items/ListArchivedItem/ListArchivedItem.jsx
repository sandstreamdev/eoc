import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import PendingButton from 'common/components/PendingButton';

class ListArchivedItem extends PureComponent {
  handleRestoringItem = () => {
    // TO DO
  };

  handleDeletingItem = () => {
    // TO DO
  };

  render() {
    const {
      data: { isOrdered, authorName, name, votesCount }
    } = this.props;

    return (
      <li className="list-archived-item">
        <div className="list-archived-item__data">
          <span className="list-archived-item__name">{name}</span>
          <span className="list-archived-item__author">{`Added by: ${authorName}`}</span>
          <div className="list-archived-item__details">
            <span>archived</span>
            <span>{`votes: ${votesCount}`}</span>
            <span>{isOrdered ? 'Done' : 'Unhandled'}</span>
          </div>
        </div>
        <div className="list-archived-item__features">
          <PendingButton
            className="link-button"
            onClick={this.handleRestoringItem}
            type="button"
          >
            restore
          </PendingButton>
          <button className="link-button" type="button">
            delete
          </button>
        </div>
      </li>
    );
  }
}

ListArchivedItem.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
      PropTypes.number,
      PropTypes.object
    ])
  )
};

export default ListArchivedItem;
