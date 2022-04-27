# Spotlight Client

This package is a React client application for the Spotlight public data publishing website. It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and is written in [TypeScript](https://www.typescriptlang.org/docs).

## Application overview

The Spotlight Client is a single-page web application built with React; most of what you will find in `src/` is React components, organized by feature. The application also contains configuration files, a Metrics API client, and data models, all of which are discussed further below.

The site consumes views of aggregate population data produced by the Recidiviz data platform (referred to here as "Metrics") and organizes them into thematic pages known as "Narratives," each of which contains an ordered set of sections displaying data visualizations and explanatory copy; it is not a "dashboard," really, although that label may be seen sometimes for mostly historical reasons.

While Spotlight is developed and deployed as a single multi-tenant website, it is primarily consumed as separate single-tenant experiences, under `.gov` subdomains owned by our state partners (e.g. [dashboard.docr.nd.gov](https://dashboard.docr.nd.gov)). To keep our infrastructure simple, this "tenant lock" is implemented in application logic within the data models, based on the URL hostname at runtime. This is why the multi-tenant "homepage" is so plain; it is really only used internally, for convenience, in development and staging environments.

We also lock the staging environment to a single tenant depending on how the logged-in user is configured. In the staging environment, a user logs in to view the site, and if their Auth0 account has a `state_code` set in their `app_metadata`, then they will be locked-in to the tenant that correspons with that `state_code`. This is so we can share a fully-functional but private version of the app with contacts of that associated agency, without exposing data to state actors that do not have permission to view other states’ data.

### Configuration and content

At its core this application is driven by a set of configuration objects, which are JavaScript objects that determine which states (or "Tenants") are displayed; which Narratives and Metrics will appear for each Tenant and what copy will appear on each of those pages (all of which is collectively referred to here as "Content"); and various other settings that can be changed per Tenant.

There is one configuration file per state, each containing a single configuration object. These files, along with supporting logic, are found in `src/contentApi/`; more information about how to use these files can be found in the [Content README](src/contentApi/README.md).

### The Metrics API

The API client, found in `src/metricsApi/`, is the counterpart to the `spotlight-api` package, which runs our server application. In addition to fetching the metric data, it transforms the raw response contents into strongly typed "Records". These are more generic than the raw responses; multiple metrics may be mapped to the same underlying Record type, which in turn allows our data models to be more generic and makes it easier to visualize different metrics the same way. There is not necessarily a 1:1 correspondence between Record type and chart form, but they are strongly correlated.

**UI components should never be interacting directly with the Metrics API!** This responsibility is handled by the data models, which are in turn consumed by UI components.

### Data models

This application uses [MobX](https://mobx.js.org/README.html) for state management; if you are unfamiliar with this package you should definitely spend some time studying their documentation, as it is quite different from other popular React state management libraries such as React Contexts or Redux. The [TL;DR](https://mobx.js.org/the-gist-of-mobx.html) on it, though, is that it is an object-oriented and reactive framework that encourages developers to centralize application state, decoupling it from the UI entirely, and to treat the UI as a side effect derived from that state. This stands in contrast to other libraries that favor a more functional style and map more closely to React's own internal rendering and state management features.

To that end, state is owned by a group of MobX [data stores](https://mobx.js.org/defining-data-stores.html), found in `src/DataStore`. The `TenantStore` is the one mainly concerned with the content and metrics described above; it owns a set of domain objects, which are Mobx observable classes defined in `src/contentModels` that consume both the configuration objects and responses from `spotlight-api`.

Each Record type defined by the API client has a corresponding Metric class; these classes use the API client to fetch data and own their own filtering and transformation logic. Filters are applied per metric (which, in practice, means per section on a given Narrative page). They are all extensions of the abstract `Metric` class, so start there if you want to understand their inner workings more deeply (e.g. to develop a new Metric type).

We strive to do as much work as possible in these models and as little as possible in the UI components; generally speaking, the UI components connect the filters to their corresponding UI controls, and own the knowledge about how to translate from our relatively generic and descriptive record formats to the APIs of our visualization components (which wrap an external chart library). As much as possible, anything else that isn't purely display logic should be lifted up into the models and data stores.

## Development

### Getting set up

If you have followed the [setup instructions](../README.md#getting-set-up) in the root directory, you should be ready to go. You should be able to test your development environment via:

    `yarn test`
    `yarn lint`

We suggest installing a linting package for your preferred code editor that hooks into [eslint](#yarn-lint). We recommend [linter-eslint](https://atom.io/packages/linter-eslint) if you're using Atom.

#### Environment variables

Second and last, set up your environment variables. There are four possible environments this code may run in: local development, test, and two deployment targets (staging and production).

You can copy the `.env.example` file and set variables accordingly per environment. Alternatively, baseline versions of the various files you may need can be found in the Recidiviz shared password manager, if you have access to that. Secrets and live environment configuration values should **never** be checked in here!

The Create React App documentation explains all the possible [env config files](https://create-react-app.dev/docs/adding-custom-environment-variables#what-other-env-files-can-be-used) you may wish to use, and how they relate to one another. At minimum you will need the following:

- `.env.development` - consumed by `yarn build-staging` to prepare a staging environment deployment
- `.env.development.local` - consumed by `yarn dev` for local development.
- `.env.test` - consumed by `yarn test`. For consistency this should mirror any env setup in the CI configuration (see `/.github/workflows`)
- `.env.production` - consumed by `yarn build` to prepare a production environment deployment

Expected environment variables include:

- `REACT_APP_AUTH_ENABLED` - set to `true` or `false` to toggle Auth0 protection per environment. Currently only used in staging to make the entire site private. No need to enable this locally unless you are developing or testing something auth-related. If set to `true` then `REACT_APP_AUTH_ENV` **must** be set to a supported value.
- `REACT_APP_AUTH_ENV` - a string indicating the "auth environment" used to point to the correct Auth0 tenant. `development` (which also covers staging) is the only supported value, which **must** be set if `REACT_APP_AUTH_ENABLED` is `true`.
- `REACT_APP_API_URL` - the base URL of the backend API server. This should be set to http://localhost:3001 when running the server locally, and to http://localhost:3002 in the test environment (because some tests will make requests to this URL).
- `REACT_APP_ENABLED_TENANTS` - a feature flag for activating individual tenants, in the form of a comma-separated list of tenant IDs (e.g., "US_ND,US_PA") that should be available. Tenants that are configured but not enumerated here will not be accessible to users.

(Note that variables must be prefixed with `REACT_APP_` to be available inside the client application.)

The build process, as described below, ensures that the proper values are compiled and included in the static bundle at build time, for the right environment.

The necessary environment variables **must** also be added to the `spotlight-staging` Github CI workflow in `/.github/workflows`; this workflow carries out automated staging deployments. It does not have access to the `.env` files used by your local environment. (Adding or updating secrets requires admin privileges on this repository; if you don't have those, reach out to a Recidiviz staff member for help.)

### Running the application locally

`yarn dev` will start a Webpack development server on port `3000` and open the homepage in your browser.

The development servers will remain active until you either close your terminal or shut it down using `control+c`.

**Note:** The frontend server does not need to be restarted when frontend source code is modified. The assets will automatically be recompiled and the browser will be refreshed.

### Authentication

This app may optionally be authenticated via [Auth0](https://auth0.com/). Auth0 settings can be inspected in the `AuthProvider` component, which wraps the entire application in a global React context using the [`@auth0/auth0-react`](https://www.npmjs.com/package/@auth0/auth0-react) library.

There is no per-view authentication; enabling auth (via environment variable, as described above) protects the entire application. We currently only enable this on our staging environment. If you are setting this app up completely fresh, you will need to create your own Auth0 account on the staging site in order to access it.

## Deploys

This app can be run locally, in staging, and in production. Deploying to staging and production are very similar, as described below.

### Pre-requisites

This React application is deployed to Firebase. To have deploy access, you need to be an admin on the Recidiviz Firebase account.

Once you have the required permissions, you can set up your environment for deploys by following [these instructions](https://firebase.google.com/docs/cli?install-cli-mac-linux). Specifically, follow the steps entitled "Install the Firebase CLI" and "Log in and test the Firebase CLI."

### Deploying to Staging

All commits to `main` are automatically deployed to the staging environment by the `spotlight-staging` Github CI workflow, keeping staging up to date as pull requests are merged. (It thus bears mentioning that you should not merge anything to `main` that isn't immediately deployable!)

You can also generate and deploy staging builds locally as needed. To generate a staging build, invoke the following yarn script: `yarn build-staging`. This will include the appropriate environment variables from `.env.development`. Each time this is run, the `/build` directory will be wiped clean.

You should then test this locally by running `firebase serve`: it will run the staging build locally, pointed to the staging API backend. (Note that this means you will have to deploy the backend to staging first if your build requires unreleased backend features.)

When you're satisfied, deploy the frontend to staging with `firebase deploy -P staging`. Test vigorously on staging before deploying to production.

### Deploying to Production

Similar to above, but with slightly different commands:

Generate a production build with `yarn build`. Test locally with `firebase serve`. Deploy the frontend with `firebase deploy -P production`.

Test vigorously! Don't be afraid to rollback the deploy through the Firebase console.

## Available Scripts

Besides the scripts mentioned above for running and deploying the app, you can also run:

### `yarn test`

Launches the test runner in the interactive watch mode.

We use [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro) for React component tests.

Also worth noting is that some integration tests execute against a real API server from `/spotlight-api`. This server process is started in `./globalTestSetup.js` and killed in `./globalTestTeardown.js`.

See the [Create React App docs](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn lint`

Runs Typescript and ESLint checks against the package to check for issues in type usage or code style.

Eslint rules are configurable in `.eslintrc.json`, which inherits from the root `../.eslintrc.json` and extends it with settings specific to this package. Any change to this file should be accompanied with an explanation for the change and why it should be merged.

Typescript rules are configurable in `./tsconfig.json`; this file was originally created by Create React App but it is safe to edit as needed.

You can also run either TS or ESLint individually; while there are not predefined scripts for this, you can inspect the definition of `lint` in `package.json` to see the individual commands that are run, and you can pass either of them to `yarn run` as needed.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

This package was bootstrapped with Create React App, which provides the option to `eject` its build tooling and configuration, allowing for full customization. See [the Create React App docs](https://create-react-app.dev/docs/available-scripts#npm-run-eject) for more information.
