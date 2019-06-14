import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _map from 'lodash/map';
import _isEmpty from 'lodash/isEmpty';

import Activity from './Activity';
import Preloader from 'common/components/Preloader';
import { fetchActivities } from '../model/actions';
import { getActivities } from '../model/selectors';
import MessageBox from 'common/components/MessageBox';
import { MessageType } from 'common/constants/enums';
import { AbortPromiseException } from 'common/exceptions/AbortPromiseException';
import { makeAbortablePromise } from 'common/utils/helpers';

class ActivitiesList extends PureComponent {
  pendingPromise = null;

  state = {
    pending: false
  };

  componentDidMount() {
    const { fetchActivities } = this.props;

    this.setState({ pending: true });

    this.pendingPromise = makeAbortablePromise(fetchActivities());
    this.pendingPromise.promise
      .then(() => this.setState({ pending: false }))
      .catch(err => {
        if (!(err instanceof AbortPromiseException)) {
          this.setState({ pending: false });
        }
      });
  }

  componentWillUnmount() {
    if (this.pendingPromise) {
      this.pendingPromise.abort();
    }
  }

  render() {
    const { activities } = this.props;
    const { pending } = this.state;

    return (
      <div className="activities-list">
        <h2 className="activities-list__heading">Activities</h2>
        <div className="activities-list__content">
          {_isEmpty(activities) ? (
            <MessageBox
              message="There are no activities."
              type={MessageType.INFO}
            />
          ) : (
            <ul className="activities-list__list">
              {_map(activities, activity => (
                <li key={activity._id}>
                  <Activity activity={activity} />
                </li>
              ))}
            </ul>
          )}
          {pending && <Preloader />}
        </div>
      </div>
    );
  }
}

ActivitiesList.propTypes = {
  activities: PropTypes.objectOf(PropTypes.object),

  fetchActivities: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  activities: getActivities(state)
});

export default connect(
  mapStateToProps,
  { fetchActivities }
)(ActivitiesList);
