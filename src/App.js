import React, { Component } from 'react';
import sortBy from 'lodash.sortby';

import CitySearchForm from './CitySearchForm.js';
import Queen from './Queen.js';

import queens from './queens.json';

class App extends Component {
  constructor(params) {
    super(params);
    this.state = {
        city: {} 
    }
    this.handleSelectCity = this.handleSelectCity.bind(this);
  }

  handleSelectCity(city) {
    this.setState({city: city});
  }

  render() {
    // Naive matching, for now
    const matchingQueens = sortBy(
        // TOOD: Fix this
        queens.filter(q => q.hometown === this.state.city.formatted_address),
        q => q.name
    );
    
    var queensList = null;
    if (matchingQueens) {
      queensList = (
        <div id="results">
          <h2>{this.state.city.formatted_address}</h2>
          <ul id="results-list">
            {matchingQueens.map(q => Queen(q))}
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
      </div>
    );
  }
}

export default App;
