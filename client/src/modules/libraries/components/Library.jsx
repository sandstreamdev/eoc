import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import License from './License';
import './Library.scss';

class Library extends PureComponent {
  state = {
    isLicenseVisible: false
  };

  toggleLicenseVisibility = () =>
    this.setState(({ isLicenseVisible }) => ({
      isLicenseVisible: !isLicenseVisible
    }));

  render() {
    const { name } = this.props;
    const { isLicenseVisible } = this.state;

    return (
      <div className="library">
        <h3 className="library__header" onClick={this.toggleLicenseVisibility}>
          {name}
        </h3>
        <License isVisible={isLicenseVisible} libraryName={name} />
      </div>
    );
  }
}

Library.propTypes = {
  name: PropTypes.string.isRequired
};

export default Library;
