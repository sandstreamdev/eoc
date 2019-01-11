import React from 'react';
import PropTypes from 'prop-types';

const VotingBox = ({ id, votesNumber, voteForItem }) => (
  <button type="button" onClick={() => voteForItem(id)}>
    {votesNumber}
  </button>
);

VotingBox.propTypes = {
  id: PropTypes.string.isRequired,
  votesNumber: PropTypes.number.isRequired,

  voteForItem: PropTypes.func.isRequired
};

export default VotingBox;
