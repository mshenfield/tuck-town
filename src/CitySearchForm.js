/*
 * An address search form that only includes locations in the
 * autocomplete and result
 */
import React, { Component } from 'react';

/* Google Maps Autocomplete widget that returns locations

This is tightly coupled to the App. Only one can exist
on a page because the `id` of the input is hard coded,
and it only fetches elements it knows are needed by
the App to find closest queens and display the city.

In addition, you must make sure to include
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script> on the page before this element in
order to populate google.maps.places in the
global namespace.
*/
export default class CitySearchForm extends Component {
  /*
        props.handleSelectCity - function(google.maps.places.PlaceResult). A function
            which accepts a PlaceResult object with formatted_address and geography
            fields populated. This will be called when the user selects an address
            on the form.
    */
  constructor(props) {
    super(props);
    this.autocomplete = null;
    this.autocomplete_listener_id = null;
    this.elementId = 'citySearchAutocomplete';
    this.selectCityHook = props.handleSelectCity;

    // bind callbacks to class
    this.onSelectCity = this.onSelectCity.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.initAutocomplete = this.initAutocomplete.bind(this);
  }

  /* Attach the Google Maps Autocomplete widget to our input */
  componentDidMount() {
    this.initAutocomplete();
  }

  /* Unregister our place_changed handler */
  componentWillUnmount() {
    const google = window.google;
    if (this.autocomplete_listener_id) {
      google.maps.event.removeListener(this.autocomplete_listener_id);
    }
  }

  /* Initializes our Google Maps Autocomplete widget */
  initAutocomplete() {
    const google = window.google;
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(this.elementId),
      {
        // We'd like to be more specific, but the "(cities)" option excludes
        // neighborhoods.
        types: ['(regions)']
      }
    );

    // Limit our results fields to _exactly_ what we need
    // to avoid getting billed for extra.
    this.autocomplete.setFields([
      // The lat/lng of the city. Can be used
      // to calculate distance from the lat/lng
      // of Queen's cities to find the closest.
      'geometry'
    ]);
    this.autocomplete_listener_id = this.autocomplete.addListener(
      'place_changed',
      this.onSelectCity
    );
  }

  /* Pass the Google Place object back to the controlling object */
  onSelectCity() {
    // This relies on the `setFields` call in the constructor to limit
    // the fields in our result to `['formatted_address', 'geometry']`
    const city = this.autocomplete.getPlace();
    this.selectCityHook(city);
  }

  /* Disable the normal submit on the form

    This means users have to select a city from the menu - they
    can't press enter
  */
  onSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        {/* Uncontrolled input used by the autocomplete object*/}
        <input
          id={this.elementId}
          type="text"
          placeholder="Enter a City or Postal Code"
        />
      </form>
    );
  }
}
