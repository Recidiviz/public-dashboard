# Spotlight Client

This package is a React client application for the next-generation Spotlight public data publishing website (not yet launched). It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and is written in [TypeScript](https://www.typescriptlang.org/docs).

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

This app can currently only be run locally or in a staging environment. Information about the production environment will be added here once it is provisioned.

### Pre-requisites

This React application is deployed to Firebase. To have deploy access, you need to be an admin on the Recidiviz Firebase account.

Once you have the required permissions, you can set up your environment for deploys by following [these instructions](https://firebase.google.com/docs/cli?install-cli-mac-linux). Specifically, follow the steps entitled "Install the Firebase CLI" and "Log in and test the Firebase CLI."

### Deploying to Staging

All commits to `master` are automatically deployed to the staging environment by the `spotlight-staging` Github CI workflow, keeping staging up to date as pull requests are merged. (It thus bears mentioning that you should not merge anything to `master` that isn't immediately deployable!)

You can also generate and deploy staging builds locally as needed. To generate a staging build, invoke the following yarn script: `yarn build-staging`. This will include the appropriate environment variables from `.env.development`. Each time this is run, the `/build` directory will be wiped clean.

You should then test this locally by running `firebase serve`: it will run the staging build locally, pointed to the staging API backend. (Note that this means you will have to deploy the backend to staging first if your build requires unreleased backend features.)

When you're satisfied, deploy the frontend to staging with `firebase deploy -P staging`. Test vigorously on staging before deploying to production.

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
