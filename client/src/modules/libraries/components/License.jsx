import React, { Fragment, PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import _isEmpty from 'lodash/isEmpty';

import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import { licensePropType } from 'common/constants/propTypes';
import Preloader, { PreloaderSize } from 'common/components/Preloader';
import { fetchLicense } from '../model/actions';
import { getLicense } from '../model/selectors';
import LicenseDetails from './LicenseDetails';
import './License.scss';

class License extends PureComponent {
  pendingPromise = null;

  state = { pending: false };

  componentDidUpdate() {
    const { isVisible, license } = this.props;
    const { pending } = this.state;
    const shouldFetchLicense = isVisible && !license && !pending;

    if (shouldFetchLicense) {
      this.getLicense();
    }
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  getLicense = async () => {
    const { fetchLicense, libraryName } = this.props;

    try {
      this.setState({ pending: true });
      this.pendingPromise = makeAbortablePromise(fetchLicense(libraryName));
      await this.pendingPromise.promise;
      this.setState({ pending: false });
    } catch (error) {
      if (!(error instanceof AbortPromiseException)) {
        this.setState({ pending: false });
      }
    }
  };

  render() {
    const { pending } = this.state;
    const { isVisible, license } = this.props;
    const isLicenseVisible = isVisible && !_isEmpty(license);

    return (
      <Fragment>
        {pending && <Preloader size={PreloaderSize.SMALL} />}
        <CSSTransition
          classNames="license-expand"
          in={isLicenseVisible}
          mountOnEnter
          timeout={300}
          unmountOnExit
        >
          <div className="license">
            <LicenseDetails license={license} />
          </div>
        </CSSTransition>
      </Fragment>
    );
  }
}

License.propTypes = {
  isVisible: PropTypes.bool,
  libraryName: PropTypes.string.isRequired,
  license: licensePropType,

  fetchLicense: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const { libraryName } = ownProps;

  return {
    license: getLicense(state, libraryName)
  };
};
export default connect(
  mapStateToProps,
  { fetchLicense }
)(License);
