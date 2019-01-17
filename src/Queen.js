/*
 * Yaaas - it's a Queen (in the results list)!
 */
import React from "react";

const Queen = queen => {
  const allStarsInfo = queen.allStarsSeason
    ? `| ${queen.allStarsSeason}, ${queen.allStarsOutcome}`
    : null;

  return (
    <li key={queen.name}>
      {queen.name} | {queen.season}, {queen.outcome} {allStarsInfo}
    </li>
  );
};

export default Queen;
