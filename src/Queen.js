/*
 * Yaaas - it's a Queen (in the results list)!
 */
import React from "react";

const Queen = queen => {
  return (
    <li key={queen.name}>
      {queen.name} | {queen.seasons.join(", ")} | {queen.outcome}
    </li>
  );
};

export default Queen;
