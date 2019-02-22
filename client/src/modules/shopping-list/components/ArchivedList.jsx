import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DialogBox from 'common/components/DialogBox';
import { deleteList, restoreList } from 'modules/shopping-list/model/actions';

class ArchivedList extends PureComponent {
  state = {
    showDialogBox: false
  };

  showDialogBox = () => {
    this.setState({ showDialogBox: true });
  };

  hideDialogBox = () => {
    this.setState({ showDialogBox: false });
  };

  restoreListHandler = listId => () => {
    const { restoreList } = this.props;
    restoreList(listId);
  };

  deleteListHandler = id => () => {
    const { deleteList } = this.props;
    deleteList(id);
  };

  render() {
    const { showDialogBox } = this.state;
    const { listId } = this.props;

    return (
      <Fragment>
        <div className="archived-message">
          <h1 className="archived-message__header">This list was archived.</h1>
          <button
            className="archived-message__button"
            onClick={this.showDialogBox}
            type="button"
          >
            permanently delete
          </button>
          <button
            className="archived-message__button"
            type="button"
            onClick={this.restoreListHandler(listId)}
          >
            restore from archive
          </button>
        </div>
        {showDialogBox && (
          <DialogBox
            message="Do you really want to permanently delete the list?"
            onCancel={this.hideDialogBox}
            onConfirm={this.deleteListHandler(listId)}
          />
        )}
      </Fragment>
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
