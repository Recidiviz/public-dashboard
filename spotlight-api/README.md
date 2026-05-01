# Spotlight API

This package is a Node/Express application that provides an API server for the `spotlight-client` web application package.

## Application overview

The Spotlight API is a thin backend that exposes metric data from the Recidiviz data platform to the open web. It has no access controls and therefore should traffic no data that is not fit for public consumption (in terms of privacy, security, confidentiality, etc.). Spotlight is a public-facing web application; while there are some access controls within the corresponding frontend application to allow for some privacy in a pre-release staging environment, you should exercise appropriate care when releasing new versions of this package.

### Metric data

This application consumes exported metric views from the Recidiviz data platform, which are just flat files retrieved from Google Cloud Storage. It passes these files through virtually untouched and generally strives to know as little about their contents as possible; all transformation logic — beyond translating them from JSON-Lines to proper JSON — is owned downstream by the frontend.

Metric files are fetched from a designated bucket, specified per environment as discussed below. This allows us to maintain separate staging and production files. To enable a new Spotlight metric, a new metric view must be created in the main Recidiviz platform application and exported to these buckets, and then that metric file must be registered in this application by adding it to the list maintained in `core/metricsApi`. This application should never serve an unregistered file to a client, even if it exists in the storage bucket.

### Caching

This application does some light in-memory caching, as the metric data is generally only updated once a day. In hotfix scenarios or others where the cache must be forcibly cleared, the deployed instances must be shut down and restarted. The easiest way to do this is generally to just redeploy the same version that's currently live.

### Fixtures

The data fixtures in `core/demo_data/` serve two purposes:

1. They are served by this application when it is run in Demo Mode, in lieu of files fetched from GCS (as discussed below).
1. They are consumed by various tests in the `spotlight-client` package that require realistic metric data. This is also accomplished by spinning up a server in Demo Mode, but is more sensitive to changes in file contents.

## Development

### Getting set up

If you have followed the [setup instructions](../README.md#getting-set-up) in the root directory, you should be ready to go. You should be able to test your development environment via:

    `yarn lint`
    `yarn test`

We suggest installing a linting package for your preferred code editor that hooks into [eslint](#yarn-lint). We recommend [linter-eslint](https://atom.io/packages/linter-eslint) if you're using Atom.

#### Environment variables

Second and last, set up your environment variables.

Copy the `.env.example` file into `.env` and set variables appropriate for your local environment. Set these same variables in your Google App Engine yaml files, if deploying to GAE. Those files are described later on.

Expected backend environment variables include:

- `GOOGLE_APPLICATION_CREDENTIALS` - a relative path pointing to the JSON file containing the credentials of the service account used to communicate with Google Cloud Storage, for metric retrieval.
- `METRIC_BUCKET` - the name of the Google Cloud Storage bucket where the metrics reside.
- `AUTH_ENABLED` - whether or not we should require authentication to access our endpoints. Currently only used in staging to make the entire site private. No need to enable this locally unless you are developing or testing something auth-related.
- `IS_DEMO` (OPTIONAL) - whether or not to run the backend in demo mode, which will retrieve static fixture data from the `core/demo_data` directory instead of pulling data from dynamic, live sources. This should only be set when running locally and should be provided through the command line.

### Running the application locally

`yarn dev` will run a development API server locally on port `3001`. The development server will remain active until you either close your terminal or shut it down using `control+c`.

**Note:** The server does not need to be restarted when source code is modified. The assets will automatically be recompiled and the browser will be refreshed — except in the case of changing fixture data in `core/demo_data` while running in demo mode (as described below).

### Demo mode

When running locally, you can run the app in demo mode to point the app to static data contained in `core/demo_data`. This is useful for debugging issues that materialize under specific data circumstances, for demonstrating the tool without exposing real data, for development when you don't have Internet access, and other use cases. (Demo mode is not perfect, as some parts of the frontend expect historical data relative to the current date, which this application does not provide.)

You can launch in demo mode by running `yarn demo`. Be sure your client application has its API url set to `localhost:3001` to consume this demo data! (For convenience, there is also [a helper script](../README.md#multi-package-tools) in the root package for running both client and server together with all proper settings.)

## Deploys

The API server app can be run locally, in staging, and in production. Deploying to staging and production are very similar, as described below.

### Pre-requisites

This application is deployed to Google App Engine. To have deploy access, you need to be an admin on the backend Google Cloud Platform project.

Once you have the required permissions, you can set up your environment for deploys by following [these instructions](https://cloud.google.com/appengine/docs/standard/nodejs/setting-up-environment).

The Recidiviz environment configuration settings (including GCP project IDs) are not checked in, but if you need access to them (i.e., you are doing development work for Recidiviz and you have GCP admin access), just ask a member of the Recidiviz engineering staff to help you out! They are stored in a shared archive in the company password manager.

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

### `yarn test`

Launches the test runner ([Jest](https://jestjs.io/)) in interactive watch mode.

### `yarn start-test-server`

Starts the server with settings that are expected by other packages that wish to run integration tests against a live server (e.g. listening on a particular port, using local data fixtures rather than fetching from GCP).

Packages that wish to use this test server will generally be responsible for provisioning it for themselves, so you shouldn't have to run this directly in order to run tests in other packages.
