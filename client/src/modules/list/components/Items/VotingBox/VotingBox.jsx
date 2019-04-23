import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ThumbIcon from 'assets/images/thumbs-up-solid.svg';

const VotingBox = ({ isVoted, onVoting, votesCount }) => (
  <button
    className={classNames('voting-box', {
      'voting-box__voted': isVoted
    })}
    onClick={e => {
      e.stopPropagation();
      onVoting();
    }}
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

VotingBox.propTypes = {
  isVoted: PropTypes.bool.isRequired,
  votesCount: PropTypes.number.isRequired,

  onVoting: PropTypes.func.isRequired
};

export default VotingBox;
