import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteList, restoreList } from 'modules/shopping-list/model/actions';
import ArchivedMessage from 'common/components/ArchivedMessage';

class ArchivedList extends PureComponent {
  restoreListHandler = listId => () => {
    const { restoreList } = this.props;
    restoreList(listId);
  };

  deleteListHandler = id => () => {
    const { deleteList } = this.props;
    return deleteList(id);
  };

  render() {
    const { listId, name } = this.props;

    return (
      <ArchivedMessage
        item="list"
        name={name}
        onDelete={this.deleteListHandler(listId)}
        onRestore={this.restoreListHandler(listId)}
      />
    );
  }
}

ArchivedList.propTypes = {
  listId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,

  deleteList: PropTypes.func.isRequired,
  restoreList: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteList, restoreList }
)(ArchivedList);
