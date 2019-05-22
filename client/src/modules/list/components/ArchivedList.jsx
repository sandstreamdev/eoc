import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteList, restoreList } from 'modules/list/model/actions';
import ArchivedMessage from 'common/components/ArchivedMessage';

class ArchivedList extends PureComponent {
  handleListRestoring = listId => () => {
    const { restoreList } = this.props;

    return restoreList(listId);
  };

  handleListDeletion = id => () => {
    const { deleteList } = this.props;

    return deleteList(id);
  };

  render() {
    const { listId, name } = this.props;

    return (
      <ArchivedMessage
        item="sack"
        name={name}
        onDelete={this.handleListDeletion(listId)}
        onRestore={this.handleListRestoring(listId)}
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
