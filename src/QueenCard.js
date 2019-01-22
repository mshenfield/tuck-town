/*
 * Yaaas - it's a Queen (in the results list)!
 */
import React from 'react';

import './QueenCard.css';
import lipstick from './lipstick.jpg';

const QueenCard = props => {
  const queen = props.queen;
  const allStarsInfo = queen.allStarsSeason ? (
    <p>
      {queen.allStarsSeason} - {queen.allStarsOutcome}
    </p>
  ) : null;

  return (
    <div className="QueenCard" key={queen.name}>
      <img
        className="QueenCard-image"
        alt="Pink lipstick (placeholder)"
        src={lipstick}
      />
      <div className="QueenCard-content">
        <h3>{queen.name}</h3>
        <p>
          {queen.season} - {queen.outcome}
        </p>
        {allStarsInfo}
      </div>
    </div>
  );
};

export default QueenCard;
