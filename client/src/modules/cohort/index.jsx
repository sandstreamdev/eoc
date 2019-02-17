import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import Toolbar from 'app/components/Toolbar/Toolbar';
import PlusIcon from 'assets/images/plus-solid.svg';

class Cohort extends PureComponent {
  get menuItems() {
    return [
      {
        label: 'Edit list',
        mainIcon: 'edit',
        onClick: this.showUpdateForm
      },
      {
        label: 'Remove list',
        mainIcon: 'remove',
        onClick: this.showDialogBox
      },
      {
        label: 'Invite user',
        mainIcon: 'invite',
        onClick: () => {},
        supplementIconSrc: PlusIcon
      }
    ];
  }

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
        <Toolbar menuItems={this.menuItems} />
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
