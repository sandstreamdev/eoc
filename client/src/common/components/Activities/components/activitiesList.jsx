import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Activity from './activity';
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
          {activities.length ? (
            <ul className="activities-list__list">
              {activities.map(activity => (
                <li key={activity._id}>
                  <Activity activity={activity} />
                </li>
              ))}
            </ul>
          ) : (
            <MessageBox
              message="There are no activities."
              type={MessageType.INFO}
            />
          )}
          {pending && <Preloader />}
        </div>
      </div>
    );
  }
}

ActivitiesList.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.object),

  fetchActivities: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  activities: getActivities(state)
});

export default connect(
  mapStateToProps,
  { fetchActivities }
)(ActivitiesList);
