import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteList, restoreList } from 'modules/shopping-list/model/actions';
import Archived from 'common/components/Archived';

class ArchivedList extends PureComponent {
  state = {
    showDialog: false
  };

  showDialog = () => {
    this.setState({ showDialog: true });
  };

  hideDialog = () => {
    this.setState({ showDialog: false });
  };

  restoreListHandler = listId => () => {
    const { restoreList } = this.props;
    restoreList(listId);
  };

  deleteListHandler = id => () => {
    const { deleteList } = this.props;
    deleteList(id).catch(this.hideDialog);
  };

  render() {
    const { showDialog } = this.state;
    const { listId } = this.props;

    return (
      <Archived
        item="list"
        isDialogVisible={showDialog}
        showDialog={this.showDialog}
        hideDialog={this.hideDialog}
        onDelete={this.deleteListHandler(listId)}
        onRestore={this.restoreListHandler(listId)}
      />
    );
  }
}

ArchivedList.propTypes = {
  listId: PropTypes.string.isRequired,

  deleteList: PropTypes.func.isRequired,
  restoreList: PropTypes.func.isRequired
};

export default connect(
  null,
  { deleteList, restoreList }
)(ArchivedList);
