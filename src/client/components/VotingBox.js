import React from 'react';
import PropTypes from 'prop-types';

const VotingBox = ({ id, voteForItem, votes, votesNumber }) => (
  <button type="button" onClick={() => voteForItem(id, votes)}>
    {votesNumber}
  </button>
);

VotingBox.propTypes = {
  id: PropTypes.string.isRequired,
  votesNumber: PropTypes.number.isRequired,
  votes: PropTypes.arrayOf(PropTypes.string),

  voteForItem: PropTypes.func.isRequired
};

export default VotingBox;
