import React, { Component } from 'react';
import chunk from 'lodash.chunk';
import sortBy from 'lodash.sortby';

import CitySearchForm from './CitySearchForm.js';
import Queen from './Queen.js';

import queens from './queens.json';

const QUEEN_CITIES = Array.from(new Set(queens.map(q => q.hometown)))

class App extends Component {
  constructor(params) {
    super(params);
    this.state = {
        closestCityInfo: null,
        errorMessage: null,
        userCity: null
    }
    this.handleSelectCity = this.handleSelectCity.bind(this);
    this.handleDistanceMatrixResponse = this.handleDistanceMatrixResponse.bind(this);
  }

  handleSelectCity(city) {
    // Reset so calculations in handleDistanceMatrixResponse work
    this.setState({closest: null})
    // From script in index.html
    const google = window.google;
    const service = new google.maps.DistanceMatrixService();
    // At most we can only pass in 25 destinations at a time
    // We reduce the results in handleDistanceMatrixResponse
    for (const cityChunk of chunk(QUEEN_CITIES, 25)) {
        service.getDistanceMatrix({
            origins: [city.formatted_address],
            destinations: cityChunk,
            travelMode: 'DRIVING',
            // I'm assuming most of our audience is U.S.
            unitSystem: google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => this.handleDistanceMatrixResponse(cityChunk, response, status)
        );
    }
    this.setState({userCity: city});
  }

  handleDistanceMatrixResponse(cityChunk, response, status) {
    if(status !== "OK"){
      this.setState({errorMessage: "There was a problem retrieving the closest queens - please try again later."});
      console.error(response, status);
      return;
    }
    // Results are in a format like
    //
    //  {
    //    rows: [
    //    // Distance from user selected city to FIRST element in QUEENS_CITY
    //    { ... },
    //    // Distance from user selected city to SECOND element in QUEENS_CITY
    //    { ... },
    //    ...
    //  }
    //
    // We iterate to find the index of the item in `rows` with the smallest
    // distance.
    var startingValue = {ix: null, result: null};
    if (this.state.closest) {
        startingValue = this.state.closest.accumulator;
        startingValue.isOriginal = true;
    }

    const results = response.rows[0].elements;
    const closest = results.reduce(
        (closest, result, ix) => {
            if (result.status !== "OK") {
                return closest;
            }
            if (closest.ix === null || result.distance.value < closest.result.distance.value) {
                return {"ix": ix, "result": result};
            }

            return closest;
        },
        startingValue
    );
    if (closest.isOriginal) {
        // This was the same value we started with
        return;
    }

    this.setState({"closest": {
        // Use the formatted_address, prettier than what we get in the Queen data
        name: response.destinationAddresses[closest.ix],
        // The version as it appears in the Queens data
        hometownish: cityChunk[closest.ix],
        distance: closest.result.distance.text,
        accumulator: closest
    }});
  }

  render() {
    var queensList = null;
    if (this.state.closest) {
      const closestQueens = queens.filter(q => q.hometown === this.state.closest.hometownish);
      const alphabetical = sortBy(closestQueens, q => q.name);
      queensList = (
        <div id="results">
          <h2>{this.state.closest.name}</h2>
          <em>{this.state.closest.distance}</em>
          <ul id="results-list">
            {alphabetical.map(q => Queen(q))}
          </ul>
        </div>
      );
    }
    

    return (
      <div className="App">
        <header className="App-header">
          <h1>Tuck Town</h1>
        </header>
        <main>
          <CitySearchForm
            handleSelectCity={this.handleSelectCity}
          />
          <div id="results">
            {queensList}
          </div>
        </main>
        <footer>
            {this.state.errorMessage}
        </footer>
      </div>
    );
  }
}

export default App;
