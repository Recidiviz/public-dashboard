This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Development

### Getting set up

First, build the app locally.

1. Grab the source:

   `git clone git@github.com:Recidiviz/public-dashboard.git`

1. Install Yarn package manager:

   `brew install yarn`

   For alternative Yarn installation options, see [Yarn Installation](https://yarnpkg.com/en/docs/install).

1. Install dependencies:

   `yarn install`

That's it! We suggest installing a linting package for your preferred code editor that hooks into [eslint](#eslint). We recommend [linter-eslint](https://atom.io/packages/linter-eslint) if you're using Atom.

At this point, you should be able to test your development environment via:

    `yarn test`
    `yarn lint`

#### Environment variables

Second and last, set up your environment variables.

For the frontend: copy the `.env.frontend.example` file and set variables accordingly per environment. At the moment, the app is deployed to both staging and production environments. Staging relies on environment variables stored in `.env.development` and production relies on variables in `.env.production`. Local relies on `.env.development.local`.

Expected frontend environment variables include:

- `REACT_APP_API_URL` - the base URL of the backend API server. This should be set to http://localhost:3001 by default when running locally.
- `REACT_APP_IS_DEMO (OPTIONAL)` - whether or not to run the frontend in demo mode, which will run the app without attempting to reach remote metric files. This should only be set when running locally and should be provided through the command line, along with the backend sibling below. To run the app in demo mode, use the following command: `./run_in_demo_mode.sh`

The build process, as described below, ensures that the proper values are compiled and included in the static bundle at build time, for the right environment.

For the backend: copy the `.env.backend.example` file into `.env` and set variables appropriate for your local environment. Set these same variables in your Google App Engine yaml files, if deploying to GAE. Those files are described later on.

Expected backend environment variables include:

- `GOOGLE_APPLICATION_CREDENTIALS` - a relative path pointing to the JSON file containing the credentials of the service account used to communicate with Google Cloud Storage, for metric retrieval.
- `METRIC_BUCKET` - the name of the Google Cloud Storage bucket where the metrics reside.
- `IS_DEMO` (OPTIONAL) - whether or not to run the backend in demo mode, which will retrieve static fixture data from the `server/core/demo_data` directory instead of pulling data from dynamic, live sources. This should only be set when running locally and should be provided through the command line, along with the frontend sibling above. To run the app in demo mode, use the following command: `./run_in_demo_mode.sh`

### Running the application locally

A yarn script is available for starting the development servers. The React frontend is served out of port `3000` and the Node/Express backend is served out of port `3001`. This will also automatically open a browser to localhost on the appropriate port, pointing to the frontend.

`yarn dev`

The development servers will remain active until you either close your terminal or shut down the entire setup at once using `control+c`.

**Note:** The frontend server does not need to be restarted when frontend source code is modified. The assets will automatically be recompiled and the browser will be refreshed. The same is true true for the backend server, except in the case of changing fixture data in `/server/core/demo_data`.

### Demo mode

When running locally, you can run the app in demo mode to point the app to static data contained in `server/core/demo_data`. This is useful for debugging issues that materialize under specific data circumstances, for demonstrating the tool without exposing real data, for development when you don't have Internet access, and other use cases.

You can launch in demo mode locally via: `./run_in_demo_mode.sh`

Running via that command is important because environment variables are required for both the frontend and backend servers. Running with only one or the other in demo mode produces a fairly broken experience.

## Deploys

As noted above, the Dashboard is two components: a React frontend and a Node/Express backend providing a thin API. The app can be run locally, in staging, and in production. Deploying to staging and production are very similar, as described below.

### Pre-requisites

The frontend of the app is deployed to Firebase. To have deploy access, you need to be an admin on the frontend Firebase/GCP account.

Once you have the required permissions, you can set up your environment for deploys by following [these instructions](https://firebase.google.com/docs/cli?install-cli-mac-linux). Specifically, follow the steps entitled "Install the Firebase CLI" and "Log in and test the Firebase CLI."

The backend of the app is deployed to Google App Engine. Similarly, to have deploy access, you need to be an admin on the backend GCP account.

Once you have the required permissions, you can set up your environment for deploys by following [these instructions](https://cloud.google.com/appengine/docs/standard/nodejs/setting-up-environment).

### Deploying to Staging

#### Frontend

To generate a staging build of the frontend, invoke the following yarn script: `yarn build-staging`.

Each time this is run, the `/build` directory will be wiped clean. A [bundle analysis](#Bundle-analysis) report, found in `build/report.html`, will also be generated on each invocation of this script. This will include the appropriate environment variables from `.env.development`.

You should then test this locally by running `firebase serve`: it will run the staging build locally, pointed to the staging API backend--if you also have backend changes, deploy the backend as described in the next subsection. When you're satisfied, deploy the frontend to staging with `firebase deploy -P staging`. Test vigorously on staging before deploying to production.

#### Backend

We deploy the backend to Google App Engine with configured yaml files. Copy the `gae.yaml.example` file into files named `gae-staging.yaml` and `gae-production.yaml`, and set environment variables accordingly.

Deploy the backend to staging Google App Engine with `gcloud app deploy gae-staging.yaml --project [project_id]`. This will upload any updated backend code/configuration to GAE and start the server (GAE runs `npm start` only once the deploy succeeds and is stable). Test vigorously on staging before continuing to production.

### Deploying to Production

Follow the instructions described above, but with different commands for both frontend and backend deploys.

Generate a production build of the frontend with `yarn build`. Test locally with `firebase serve`. Deploy the frontend with `firebase deploy -P production`.

Deploy the backend to production GAE with `gcloud app deploy gae-production.yaml --project [project_id]`.

Test vigorously! Don't be afraid to rollback the deploy of frontend or backend through the Firebase and GAE consoles.

## Available Scripts

Besides the scripts mentioned above for running and deploying the app, you can also run:

### `yarn test`

Launches the test runner in the interactive watch mode.

We use [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro)
for component tests you will want to import the testing-library functions via `src/testUtils.js`
instead; it re-exports the full API from `@testing-library/react` with a wrapper around `render`
that includes any globally expected React Context providers (e.g. the `ThemeProvider` for `styled-components`).

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn lint`

Runs the eslint checks against the repository to check for issues in code style.

Eslint rules are configurable in `.eslintrc.json`. Any change to this file should be accompanied with an explanation
for the change and why it should be merged.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
