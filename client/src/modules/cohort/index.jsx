import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'common/components/Toolbar/Toolbar';
import ToolbarItem from 'common/components/Toolbar/components/ToolbarItem/ToolbarItem';
import { IconType } from 'common/constants/enums';

class Cohort extends PureComponent {
  showUpdateForm = () => {};

  showDialogBox = () => {};

  render() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    return (
      <Fragment>
        <Toolbar>
          <ToolbarItem mainIcon={IconType.EDIT} onClick={this.showUpdateForm} />
          <ToolbarItem
            mainIcon={IconType.REMOVE}
            onClick={this.showDialogBox}
          />
          <ToolbarItem mainIcon={IconType.INVITE} onClick={() => {}} />
        </Toolbar>
        <div>{`Cohort of id: ${id}`}</div>
      </Fragment>
    );
  }
}

Cohort.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }).isRequired
};

export default Cohort;
