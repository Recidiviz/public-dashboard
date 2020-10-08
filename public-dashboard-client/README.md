# Public Dashboard Client

This package is a React client application for the Spotlight public dashboard website. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

![CI: Public Dashboard API](https://github.com/Recidiviz/public-dashboard/workflows/CI:%20Public%20Dashboard%20API/badge.svg)

## Development

### Getting set up

If you have followed the [setup instructions](../README.md#getting-set-up) in the root directory, you should be ready to go. You should be able to test your development environment via:

    `yarn test`
    `yarn lint`

We suggest installing a linting package for your preferred code editor that hooks into [eslint](#yarn-lint). We recommend [linter-eslint](https://atom.io/packages/linter-eslint) if you're using Atom.

#### Environment variables

Second and last, set up your environment variables. Copy the `.env.example` file and set variables accordingly per environment. At the moment, the app is deployed to both staging and production environments. Staging relies on environment variables stored in `.env.development` and production relies on variables in `.env.production`. Local relies on `.env.development.local`.

Expected environment variables include:

- `REACT_APP_API_URL` - the base URL of the backend API server. (This should be set to http://localhost:3001 when running the server locally.)

The build process, as described below, ensures that the proper values are compiled and included in the static bundle at build time, for the right environment.

### Running the application locally

`yarn dev` will start a Webpack development server on port `3000` and open the homepage in your browser.

The development servers will remain active until you either close your terminal or shut it down using `control+c`.

**Note:** The frontend server does not need to be restarted when frontend source code is modified. The assets will automatically be recompiled and the browser will be refreshed.

## Deploys

This app can be run locally, in staging, and in production. Deploying to staging and production are very similar, as described below.

### Pre-requisites

This React application is deployed to Firebase. To have deploy access, you need to be an admin on the frontend Firebase account.

Once you have the required permissions, you can set up your environment for deploys by following [these instructions](https://firebase.google.com/docs/cli?install-cli-mac-linux). Specifically, follow the steps entitled "Install the Firebase CLI" and "Log in and test the Firebase CLI."

### Deploying to Staging

To generate a staging build, invoke the following yarn script: `yarn build-staging`.

Each time this is run, the `/build` directory will be wiped clean. A bundle analysis report, found in `build/report.html`, will also be generated on each invocation of this script. This will include the appropriate environment variables from `.env.development`.

You should then test this locally by running `firebase serve`: it will run the staging build locally, pointed to the staging API backend. When you're satisfied, deploy the frontend to staging with `firebase deploy -P staging`. Test vigorously on staging before deploying to production.

### Deploying to Production

Similar to above, but with slightly different commands:

Generate a production build with `yarn build`. Test locally with `firebase serve`. Deploy the frontend with `firebase deploy -P production`.

Test vigorously! Don't be afraid to rollback the deploy through the Firebase console.

## Available Scripts

Besides the scripts mentioned above for running and deploying the app, you can also run:

### `yarn test`

Launches the test runner in the interactive watch mode.

We use [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro), but for component tests you will want to import the testing-library functions via `src/testUtils.js` instead; it re-exports the full API from `@testing-library/react` with a wrapper around `render` that includes any globally expected React Context providers (e.g. the `ThemeProvider` for `styled-components`).

See the [Create React App docs](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn lint`

Runs the eslint checks against the package to check for issues in code style.

Eslint rules are configurable in `.eslintrc.json`, which inherits from the root `../.eslintrc.json` and extends it with settings specific to this package. Any change to this file should be accompanied with an explanation for the change and why it should be merged.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

This package was bootstrapped with Create React App, which provides the option to `eject` its build tooling and configuration, allowing for full customization. See [the Create React App docs](https://create-react-app.dev/docs/available-scripts#npm-run-eject) for more information.
