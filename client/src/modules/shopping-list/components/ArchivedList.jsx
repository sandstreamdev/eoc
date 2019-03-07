import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { deleteList, restoreList } from 'modules/shopping-list/model/actions';
import Archived from 'common/components/Archived';

class ArchivedList extends PureComponent {
  state = {
    isDialogVisible: false
  };

  showDialogHandler = () => {
    this.setState({ isDialogVisible: true });
  };

  hideDialogHandler = () => {
    this.setState({ isDialogVisible: false });
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
    const { isDialogVisible } = this.state;
    const { listId, name } = this.props;

    return (
      <Archived
        isDialogVisible={isDialogVisible}
        item="list"
        name={name}
        onDelete={this.deleteListHandler(listId)}
        onHideDialog={this.hideDialogHandler}
        onRestore={this.restoreListHandler(listId)}
        onShowDialog={this.showDialogHandler}
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
