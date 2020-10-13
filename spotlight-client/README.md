# Spotlight Client

This package is a React client application for the next-generation Spotlight public data publishing website (not yet launched). It was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and is written in [TypeScript](https://www.typescriptlang.org/docs).

![CI: Spotlight Client](https://github.com/Recidiviz/public-dashboard/workflows/CI:%20Spotlight%20Client/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/Recidiviz/public-dashboard/badge.svg?branch=master)](https://coveralls.io/github/Recidiviz/public-dashboard?branch=master)

## Development

### Getting set up

If you have followed the [setup instructions](../README.md#getting-set-up) in the root directory, you should be ready to go. You should be able to test your development environment via:

    `yarn test`
    `yarn lint`

We suggest installing a linting package for your preferred code editor that hooks into [eslint](#yarn-lint). We recommend [linter-eslint](https://atom.io/packages/linter-eslint) if you're using Atom.

### Running the application locally

`yarn dev` will start a Webpack development server on port `3000` and open the homepage in your browser.

The development servers will remain active until you either close your terminal or shut it down using `control+c`.

**Note:** The frontend server does not need to be restarted when frontend source code is modified. The assets will automatically be recompiled and the browser will be refreshed.

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
