import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ThumbIcon from 'assets/images/thumbs-up-solid.svg';
import { handleEventPropagation } from 'common/utils/helpers';

class VotingBox extends PureComponent {
  handleOnClick = event => {
    event.stopPropagation();
    const { voteForItem } = this.props;

    voteForItem();
  };

  render() {
    const { isMember, isVoted, votesCount } = this.props;

    return (
      <button
        className={classNames('voting-box', {
          'voting-box__voted': isVoted,
          'voting-box__disabled': !isMember
        })}
        onClick={isMember ? this.handleOnClick : handleEventPropagation}
        type="button"
      >
        <img
          alt={`${isVoted ? 'remove your vote' : 'vote'}`}
          className="voting-box__icon"
          src={ThumbIcon}
        />
        {votesCount}
      </button>
    );
  }
}

VotingBox.propTypes = {
  isMember: PropTypes.bool.isRequired,
  isVoted: PropTypes.bool.isRequired,
  votesCount: PropTypes.number.isRequired,

  voteForItem: PropTypes.func
};

export default VotingBox;
