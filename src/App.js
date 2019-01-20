import React, { Component } from "react";

import minBy from "lodash.minby";
import sortBy from "lodash.sortby";

import CitySearchForm from "./CitySearchForm.js";
import Queen from "./Queen.js";

import logo from './logo.svg';
import './App.css';

// cityCoords were manually generated
// using the google.maps.Geocoder in
// the browser console.
import cityCoords from "./cityCoords.json";
import queens from "./queens.json";

/* Calculates the distance as the crow flies between two points (lat/long pairs)

Formula is copied from
https://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript
*/
function haversineDistance(latLng1, latLng2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  var R = 6371; // km

  var x1 = latLng2.lat - latLng1.lat;
  var dLat = toRad(x1);
  var x2 = latLng2.lng - latLng1.lng;
  var dLon = toRad(x2);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(latLng1.lat)) *
      Math.cos(toRad(latLng2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  // distance in miles
  return (d /= 1.60934);
}

class App extends Component {
  constructor(params) {
    super(params);
    this.state = {
      closest: null,
      errorMessage: null,
      userCity: null
    };
    this.handleSelectCity = this.handleSelectCity.bind(this);
  }

  handleSelectCity(city) {
    // Find the city above with the closest distance
    const queenCities = Array.from(new Set(queens.map(q => q.hometown)));
    const userLatLng = city.geometry.location.toJSON();
    const closestCityName = minBy(queenCities, c => {
      if (!cityCoords[c]) {
        console.error(
          `Missing coords for city ${c}. Make sure to add it to cityCoords.json`
        );
        return Infinity;
      }
      return haversineDistance(cityCoords[c], userLatLng);
    });
    this.setState({
      userCity: city,
      closest: {
        distance: haversineDistance(cityCoords[closestCityName], userLatLng),
        name: closestCityName
      }
    });
  }

  render() {
    var queensList = null;
    if (this.state.closest) {
      const closestQueens = queens.filter(
        q => q.hometown === this.state.closest.name
      );
      const alphabetical = sortBy(closestQueens, q => q.name);
      // Treat it as an exact match if it's closer than 2m
      const distance =
        this.state.closest.distance < 2
          ? "Exact Match"
          : Math.round(this.state.closest.distance) + " miles";
      queensList = (
        <div id="results">
          <h2>{this.state.closest.name}</h2>
          <em>{distance}</em>
          <ul id="results-list">{alphabetical.map(q => Queen(q))}</ul>
        </div>
      );
    }

    return (
      <div>
        <div className="HeroImage">
          <div className="HeroImage-content">
            <nav>
              <img alt="Tuck Town logo" className="logo" src={logo} />
            </nav>
            <div className="Separator"/>
            <div className="HeroImage-cta">
              <header>
                <h1>Find the Closest Rupaul’s Drag Race Queen!</h1>
              </header>
              <CitySearchForm className="CitySearchForm" handleSelectCity={this.handleSelectCity} />
            </div>
          </div>
        </div>
        <main>
          {queensList}
        </main>
      </div>
    );
  }
}

export default App;
