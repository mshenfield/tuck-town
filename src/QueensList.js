/*
 * The Queens result list, ordered alphabetically
 */
import React from 'react';

import sortBy from 'lodash.sortby';

import QueenCard from './QueenCard.js';

const QueensList = props => {
  const alphabetical = sortBy(props.queens, q => q.name);

  return (
    <div className="QueensList">
      {alphabetical.map(q => (
        <QueenCard key={q.name} queen={q} />
      ))}
    </div>
  );
};

export default QueensList;
