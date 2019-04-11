import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteList, restoreList } from 'modules/list/model/actions';
import ArchivedMessage from 'common/components/ArchivedMessage';

class ArchivedList extends PureComponent {
  constructor(props) {
    super(props);

    const { pending } = this.props;
    this.state = {
      pending,
      pendingMessage: ''
    };
  }

  handleListRestoring = listId => () => {
    const { name, restoreList } = this.props;

    this.setState(
      { pending: true, pendingMessage: `Restoring "${name}" list...` },
      () =>
        restoreList(listId).catch(() =>
          this.setState({ pending: false, pendingMessage: '' })
        )
    );
  };

  handleListDeletion = id => () => {
    const { deleteList } = this.props;
    return deleteList(id);
  };

  render() {
    const { listId, name } = this.props;

    const { pending, pendingMessage } = this.state;

    return (
      <ArchivedMessage
        item="list"
        name={name}
        pending={pending}
        pendingMessage={pendingMessage}
        onDelete={this.handleListDeletion(listId)}
        onRestore={this.handleListRestoring(listId)}
      />
    );
  }
}

ArchivedList.propTypes = {
  listId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  pending: PropTypes.bool.isRequired,

  deleteList: PropTypes.func.isRequired,
  restoreList: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteList, restoreList }
)(ArchivedList);
