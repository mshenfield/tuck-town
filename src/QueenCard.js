/*
 * Yaaas - it's a Queen (in the results list)!
 */
import React from 'react';

import './QueenCard.css';
import lipstick from './lipstick.jpg';

const QueenCard = props => {
  const queen = props.queen;
  const allStarsInfo = queen.allStarsSeason ? (
    <div>
      <br />
      {queen.allStarsSeason} - {queen.allStarsOutcome}
    </div>
  ) : null;

  return (
    <li className="QueenCard" key={queen.name}>
      <div>
        <div className="col1">
          <img alt="Pink lipstick (placeholder)" src={lipstick} />
        </div>
        <div className="col2and3">
          <h3>{queen.name}</h3>
          {queen.season} - {queen.outcome}
          {allStarsInfo}
        </div>
      </div>
    </li>
  );
};

export default QueenCard;
