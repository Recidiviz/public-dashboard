# Spotlight Client

This package is a React client application for the next-generation Spotlight public data publishing website (not yet launched). It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and is written in [TypeScript](https://www.typescriptlang.org/docs).

## Development

### Getting set up

If you have followed the [setup instructions](../README.md#getting-set-up) in the root directory, you should be ready to go. You should be able to test your development environment via:

    `yarn test`
    `yarn lint`

We suggest installing a linting package for your preferred code editor that hooks into [eslint](#yarn-lint). We recommend [linter-eslint](https://atom.io/packages/linter-eslint) if you're using Atom.

#### Environment variables

Second and last, set up your environment variables. Copy the `.env.example` file and set variables accordingly per environment. The app can be deployed to both staging and production environments. Staging relies on environment variables stored in `.env.development` and production relies on variables in `.env.production`. Local relies on `.env.development.local`.

Expected environment variables include:

- `REACT_APP_AUTH_ENABLED` - set to `true` or `false` to toggle Auth0 protection per environment. Currently only used in staging to make the entire site private. No need to enable this locally unless you are developing or testing something auth-related.
- `REACT_APP_AUTH_ENV` - a string indicating the "auth environment" used to point to the correct Auth0 tenant. Either "development" (which also covers staging) or "production".

(Note that variables must be prefixed with `REACT_APP_` to be available inside the client application.)

The build process, as described below, ensures that the proper values are compiled and included in the static bundle at build time, for the right environment.

### Running the application locally

`yarn dev` will start a Webpack development server on port `3000` and open the homepage in your browser.

The development servers will remain active until you either close your terminal or shut it down using `control+c`.

**Note:** The frontend server does not need to be restarted when frontend source code is modified. The assets will automatically be recompiled and the browser will be refreshed.

### Authentication

This app may optionally be authenticated via [Auth0](https://auth0.com/). Auth0 settings can be inspected in the `AuthProvider` component, which wraps the entire application in a global React context using the [`@auth0/auth0-react`](https://www.npmjs.com/package/@auth0/auth0-react) library.

There is no per-view authentication; enabling auth (via environment variable, as described above) protects the entire application. We currently only enable this on our staging environment. If you are setting this app up completely fresh, you will need to create your own Auth0 account on the staging site in order to access it.

## Deploys

Not yet implemented! Instructions will be found here once a process is in place.

## Available Scripts

Besides the scripts mentioned above for running and deploying the app, you can also run:

### `yarn test`

Launches the test runner in the interactive watch mode.

We use [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro) for React component tests.

See the [Create React App docs](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn lint`

Runs Typescript and ESLint checks against the package to check for issues in type usage or code style.

Eslint rules are configurable in `.eslintrc.json`, which inherits from the root `../.eslintrc.json` and extends it with settings specific to this package. Any change to this file should be accompanied with an explanation for the change and why it should be merged.

Typescript rules are configurable in `./tsconfig.json`; this file was originally created by Create React App but it is safe to edit as needed.

You can also run either TS or ESLint individually; while there are not predefined scripts for this, you can inspect the definition of `lint` in `package.json` to see the individual commands that are run, and you can pass either of them to `yarn run` as needed.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

This package was bootstrapped with Create React App, which provides the option to `eject` its build tooling and configuration, allowing for full customization. See [the Create React App docs](https://create-react-app.dev/docs/available-scripts#npm-run-eject) for more information.
