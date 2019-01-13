# Tuck Town
Find the RuPaul's Drag contestant closest to you.

This is still very much a WIP - stay tuned.

## Running
This can be run using the following commands:

```bash
REACT_APP_GOOGLE_API_KEY=<your-google-project-API-key> yarn start
```

### Google API Setup
This project utilizes the Google Places Autocomplete widget, and the Google Distance Matrix API. To setup:

* Go to your project's page in [the Google Cloud Console](console.cloud.google.com)
* Go to the [API's Dashboard](https://console.cloud.google.com/apis/dashboard) for your project
* Click "+ Enable APIs and Services"
* Search for and enable the following APIs
    * Maps JavaScript API
    * Places API for Web
    * Distance Matrix API
* Navigate to the "Credentials" menu
* Follow steps to "Create credentials", making sure to select "API Key" from the dropdown.

WARNING: Enabling an API key _will_ charge money if you exceed the $200 usage limit. Please follow best practices for [securing and limiting usage of your API key](https://support.google.com/cloud/answer/6310037?hl=en_US). There are serious financial risks if someone steals an unsecured API key.

You can use the created API as the `REACT_APP_GOOGLE_API_KEY` in the [run command above](#running). You can also add your key to the .gitignor-ed `.env.local` file or use any of the [methods described here](https://facebook.github.io/create-react-app/docs/adding-custom-environment-variables#adding-temporary-environment-variables-in-your-shell) to set it.

### Additional Commands
See the [Create React App Guide](./CREATE_REACT_APP_GUIDE.md) for a full list of commands.

## Tests 
None yet 🐛🐛🐛

## License
[MIT](LICENSE)
