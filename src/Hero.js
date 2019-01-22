/* Above the fold content and hero image */
import React from 'react';

import CitySearchForm from './CitySearchForm.js';
import logo from './logo.svg';

import './Hero.css';

const Hero = props => {
  return (
    <div className="Hero">
      <nav className="Nav">
        <img alt="Tuck Town logo" className="Nav-logo" src={logo} />
        <div className="Nav-separator" />
      </nav>
      <div className="Hero-content">
        <h1 className="HeroImage-header">
          Find the Closest Rupaul’s Drag Race Queen!
        </h1>
        <CitySearchForm
          className="CitySearchForm"
          handleSelectCity={props.handleSelectCity}
        />
      </div>
    </div>
  );
};

export default Hero;
