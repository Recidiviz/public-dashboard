# Spotlight API

This package is a Node/Express server application that provides a thin API backend for clients consuming public metrics from the Recidiviz data pipeline.

## Development

### Getting set up

If you have followed the [setup instructions](../README.md#getting-set-up) in the root directory, you should be ready to go. You should be able to test your development environment via:

    `yarn lint`

We suggest installing a linting package for your preferred code editor that hooks into [eslint](#yarn-lint). We recommend [linter-eslint](https://atom.io/packages/linter-eslint) if you're using Atom.

#### Environment variables

Second and last, set up your environment variables.

Copy the `.env.example` file into `.env` and set variables appropriate for your local environment. Set these same variables in your Google App Engine yaml files, if deploying to GAE. Those files are described later on.

Expected backend environment variables include:

- `GOOGLE_APPLICATION_CREDENTIALS` - a relative path pointing to the JSON file containing the credentials of the service account used to communicate with Google Cloud Storage, for metric retrieval.
- `METRIC_BUCKET` - the name of the Google Cloud Storage bucket where the metrics reside.
- `IS_DEMO` (OPTIONAL) - whether or not to run the backend in demo mode, which will retrieve static fixture data from the `core/demo_data` directory instead of pulling data from dynamic, live sources. This should only be set when running locally and should be provided through the command line.

### Running the application locally

`yarn dev` will run a development API server locally on port `3001`. The development server will remain active until you either close your terminal or shut it down using `control+c`.

**Note:** The server does not need to be restarted when source code is modified. The assets will automatically be recompiled and the browser will be refreshed — except in the case of changing fixture data in `/server/core/demo_data` while running in demo mode (as described below).

### Demo mode

When running locally, you can run the app in demo mode to point the app to static data contained in `server/core/demo_data`. This is useful for debugging issues that materialize under specific data circumstances, for demonstrating the tool without exposing real data, for development when you don't have Internet access, and other use cases.

You can launch in demo mode by running `yarn demo`. Be sure your client application has its API url set to `localhost:3001` to consume this demo data! (For convenience, there is also [a helper script](../README.md#multi-package-tools) in the root package for running both client and server together with all proper settings.)

## Deploys

The API server app can be run locally, in staging, and in production. Deploying to staging and production are very similar, as described below.

### Pre-requisites

This application is deployed to Google App Engine. To have deploy access, you need to be an admin on the backend Google Cloud Platform project.

Once you have the required permissions, you can set up your environment for deploys by following [these instructions](https://cloud.google.com/appengine/docs/standard/nodejs/setting-up-environment).

The Recidiviz environment configuration settings (including GCP project IDs) are not checked in, but if you need access to them (i.e., you are doing development work for Recidiviz and you have GCP admin access), just ask a member of the Recidiviz engineering staff to help you out!

### Deploying to Staging

We deploy this application to Google App Engine with configured yaml files. Copy the `gae.yaml.example` file into files named `gae-staging.yaml` and `gae-production.yaml`, and set environment variables accordingly.

Deploy to staging Google App Engine with `gcloud app deploy gae-staging.yaml --project [staging_project_id]`. This will upload any updated backend code/configuration to GAE and start the server (GAE runs `npm start` only once the deploy succeeds and is stable). Test vigorously on staging before continuing to production.

### Deploying to Production

Similarly to above, deploy to production GAE with `gcloud app deploy gae-production.yaml --project [production_project_id]`.

Test vigorously! Don't be afraid to rollback the deploy through the GAE console.

## Available Scripts

Besides the scripts mentioned above for running and deploying the app, you can also run:

### `yarn lint`

Runs the eslint checks against the package to check for issues in code style.

Eslint rules are configurable in `.eslintrc.json`, which inherits from the root `../.eslintrc.json` and extends it with settings specific to this package. Any change to this file should be accompanied with an explanation for the change and why it should be merged.
