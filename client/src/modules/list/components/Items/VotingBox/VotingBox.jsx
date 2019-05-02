import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ThumbIcon from 'assets/images/thumbs-up-solid.svg';
import PendingButton from 'common/components/PendingButton';

const VotingBox = ({ isVoted, onVote, votesCount }) => (
  <PendingButton
    className={classNames('voting-box', {
      'voting-box__voted': isVoted
    })}
    onClick={onVote}
  >
    <img
      alt={`${isVoted ? 'remove your vote' : 'vote'}`}
      className="voting-box__icon"
      src={ThumbIcon}
    />
    {votesCount}
  </PendingButton>
);

VotingBox.propTypes = {
  isVoted: PropTypes.bool.isRequired,
  votesCount: PropTypes.number.isRequired,

  onVote: PropTypes.func.isRequired
};

export default VotingBox;
