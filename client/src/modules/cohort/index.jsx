import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'common/components/Toolbar/Toolbar';
import ToolbarItem from 'common/components/Toolbar/components/ToolbarItem/ToolbarItem';
import { IconType } from 'assets/images/icons';
import PlusIcon from 'assets/images/plus-solid.svg';

class Cohort extends PureComponent {
  render() {
    const {
      match: {
        params: { id }
      }
    } = this.props;

    return (
      <Fragment>
        <Toolbar>
          <ToolbarItem mainIcon={IconType.EDIT} onClick={() => {}} />
          <ToolbarItem mainIcon={IconType.REMOVE} onClick={() => {}} />
          <ToolbarItem
            mainIcon={IconType.INVITE}
            onClick={() => {}}
            additionalIconSrc={PlusIcon}
          />
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
