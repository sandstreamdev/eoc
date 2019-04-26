import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import ThumbIcon from 'assets/images/thumbs-up-solid.svg';

const VotingBox = ({ disabled, isVoted, onVote, votesCount }) => (
  <button
    className={classNames('voting-box', {
      'voting-box__voted': isVoted
    })}
    disabled={disabled}
    onClick={e => {
      e.stopPropagation();
      onVote();
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
  disabled: PropTypes.bool,
  isVoted: PropTypes.bool.isRequired,
  votesCount: PropTypes.number.isRequired,

  onVote: PropTypes.func.isRequired
};

export default VotingBox;
