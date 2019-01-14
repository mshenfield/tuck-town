/*
 * An address search form that only includes cities in the autocomplete and result
 */
import React, { Component } from "react";

/* Google Maps Autocomplete widget that returns cities

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
    this.elementId = "citySearchAutocomplete";
    this.selectCityHook = props.handleSelectCity;

    // bind callbacks to class
    this.onSelectCity = this.onSelectCity.bind(this);
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
        // only allow selecting cities and towns
        types: ["(cities)"],
        // For now, restrict results to the U.S. so
        // there is some kind of computable, drivable
        // route. The way the call to Distance Matrix
        // is structured right now means we'll only
        // return a result if it can be driven to.
        componentRestrictions: { country: "us" }
      }
    );

    // Limit our results fields to _exactly_ what we need
    // to avoid getting billed for extra.
    this.autocomplete.setFields([
      // The formatted address can be used directly as
      // an input to the Maps Distance Matrix API
      "formatted_address"
    ]);
    this.autocomplete_listener_id = this.autocomplete.addListener(
      "place_changed",
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

  render() {
    return (
      <form>
        {/* Uncontrolled input used by the autocomplete object*/}
        <input id={this.elementId} type="text" placeholder="Enter your city" />
      </form>
    );
  }
}
