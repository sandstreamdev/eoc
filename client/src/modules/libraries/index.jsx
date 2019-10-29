import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';
import Preloader from 'common/components/Preloader';
import { fetchLibraries } from './model/actions';
import { getLibrariesNames } from './model/selectors';
import Library from './components/Library';
import './Libraries.scss';

class Libraries extends PureComponent {
  pendingPromise = null;

  state = {
    pending: false
  };

  componentDidMount() {
    this.getLibraries();
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  getLibraries = async () => {
    const { fetchLibraries } = this.props;

    this.setState({ pending: true });

    try {
      this.pendingPromise = makeAbortablePromise(fetchLibraries());
      await this.pendingPromise.promise;
      this.setState({ pending: false });
    } catch (error) {
      if (!(error instanceof AbortPromiseException)) {
        this.setState({ pending: false });
      }
    }
  };

  render() {
    const { libraries } = this.props;
    const { pending } = this.state;

    return (
      <div className="wrapper">
        <div className="libraries">
          <h2 className="libraries__header">
            <FormattedMessage id="libraries.title" />
          </h2>
          <div className="libraries__content">
            <ul className="libraries__list">
              {libraries.map(name => (
                <li className="libraries__item" key={name}>
                  <Library name={name} />
                </li>
              ))}
            </ul>
            {pending && <Preloader />}
          </div>
        </div>
      </div>
    );
  }
}

Libraries.propTypes = {
  libraries: PropTypes.arrayOf(PropTypes.string),

  fetchLibraries: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  libraries: getLibrariesNames(state)
});

export default connect(
  mapStateToProps,
  { fetchLibraries }
)(Libraries);
