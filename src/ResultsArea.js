/* Results area, including header and list */
import React from 'react';

import QueensList from './QueensList.js';

import './ResultsArea.css';

const ResultsArea = props => {
  if (!props.closestCity) {
    return null;
  }
  const closestQueens = props.queens.filter(
    q => q.hometown === props.closestCity.name
  );

  // Treat it as an exact match if it's closer than 2m
  const distance =
    props.closestCity.distance < 2
      ? ''
      : ' ' + Math.round(props.closestCity.distance) + ' miles away';

  return (
    <div class="ResultsArea">
      <div class="ResultsArea-content">
        <h2>CLOSEST RUGIRLS</h2>
        <h3>
          {props.closestCity.name}
          {distance}
        </h3>
        <QueensList queens={closestQueens} />
      </div>
    </div>
  );
};

export default ResultsArea;
