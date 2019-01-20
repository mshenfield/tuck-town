/*
 * The Queens result list
 */
import React from "react";

import sortBy from "lodash.sortby";

import QueenCard from './QueenCard.js';

const QueensList = (props) => {
    const queens = props.queens;
    const closestCity = props.closestCity;
    const alphabetical = sortBy(queens, q => q.name);
    // Treat it as an exact match if it's closer than 2m
    const distance =
      closestCity.distance < 2
        ? "Exact Match"
        : Math.round(closestCity.distance) + " miles away";
    return (
      <div className="QueensList">
        <h2>CLOSEST RUGIRLS</h2>
        <h3>{closestCity.name}, {distance}</h3>
        <ul id="results-list">{alphabetical.map(q => <QueenCard key={q.name} queen={q}/>)}</ul>
      </div>
    );
};

export default QueensList;
