import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ThumbIcon } from 'assets/images/icons';
import PendingButton from 'common/components/PendingButton';

const VotingBox = ({ isMember, isVoted, onVote, votesCount }) => (
  <PendingButton
    className={classNames('voting-box', {
      'voting-box__voted': isVoted
    })}
    disabled={!isMember}
    onClick={onVote}
    title={`${isVoted ? 'remove your vote' : 'vote'}`}
  >
    <ThumbIcon />
    {votesCount}
  </PendingButton>
);

VotingBox.propTypes = {
  isMember: PropTypes.bool.isRequired,
  isVoted: PropTypes.bool.isRequired,
  votesCount: PropTypes.number.isRequired,

  onVote: PropTypes.func.isRequired
};

export default VotingBox;
