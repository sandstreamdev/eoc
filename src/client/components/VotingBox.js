import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const VotingBox = ({ voteForItem, votesNumber, whetherUserVoted }) => (
  <button
    aria-label="Vote for item"
    className={classNames('voting-box', {
      'voting-box__voted': whetherUserVoted
    })}
    type="button"
    onClick={e => {
      e.stopPropagation();
      voteForItem();
    }}
  >
    <i className="fas fa-thumbs-up voting-box__icon" />
    {votesNumber}
  </button>
);

VotingBox.propTypes = {
  votesNumber: PropTypes.number.isRequired,
  whetherUserVoted: PropTypes.bool.isRequired,

  voteForItem: PropTypes.func.isRequired
};

export default VotingBox;
