# Spotlight

This repository contains npm packages related to our Spotlight data publishing product, as well as some shared configuration and tooling that involves multiple packages.

![Build Status](https://github.com/Recidiviz/public-dashboard/workflows/Build%20Status/badge.svg) [![Coverage Status](https://coveralls.io/repos/github/Recidiviz/public-dashboard/badge.svg?branch=master)](https://coveralls.io/github/Recidiviz/public-dashboard?branch=master)

## Packages in this repository

More information about how to use each individual package can be found in their respective README files.

### [Public Dashboard Client](public-dashboard-client/)

A React application for the original Spotlight website (North Dakota only)

### [Spotlight API](spotlight-api/)

A thin Node/Express backend that serves data for the Spotlight website.

### [Spotlight Client](spotlight-client/)

A React application for the next-generation Spotlight website (not yet launched).

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

That's it! We suggest installing a linting package for your preferred code editor that hooks into eslint. (Note that you may need to configure your linting plugin to use multiple package directories.)

Individual packages may require some additional configuration to work properly; refer to their respective README files for more information.

### Multi-package tools

We use [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/) for some light multi-package management on top of standard Yarn commands.

This means that running `yarn install` in the root or in any package directory will install the dependencies for all packages in the repository — so you only need to do it once no matter how many packages you wish to use.

It also allows you to run a Yarn command sequentially in each package with `yarn workspaces <command>` or individually with `yarn workspace <workspace-name> <command>` as an alternative to setting your working directory to the package's directory before executing it. For example, if you wanted to run lint tests for the entire repository, you could use `yarn workspaces run lint` to run the `lint` script in each package.

In addition, there are some Yarn scripts defined in the root package as a convenience for running multiple packages in a coordinated fashion:

`yarn dev:pd` — starts the development servers for the Spotlight API and the Public Dashboard Client in a single terminal window. Be sure you have configured each of those applications with the necessary environment variables, as described in their README files, or this will not work!

`yarn dev:spotlight` - similar to the above, but with Spotlight Client as the frontend.

`yarn demo:pd` — starts the development servers for the Spotlight API and the Public Dashboard client in "demo mode" by supplying the necessary environment variables in the command line. (This will run your local site off of fake data fixtures rather than live data from a calculation pipeline; see the [Spotlight API documentation](spotlight-api/#demo-mode) for more information.)

`yarn demo:spotlight` - again, similar to the above, with with Spotlight Client as the frontend.

`yarn test` - runs the tests for all packages in a single command. (The output this produces is pretty messy at the moment but it can be useful for editor integration)

### Code editor integration

Your code editor may need some additional configuration to properly integrate with this monorepo setup. While not exhaustive, these are some tips we have found useful for ourselves:

#### Visual Studio Code

- install the [ESLint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint), and in your Workspace settings, set the ESLint Working Directories to an array of all the package directories.
- install the [Jest plugin](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest), and in your Workspace settings, set the "path to Jest" to `yarn test --`

### Other tools

Style and formatting rules for this repository are defined with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/). The base configuration lives in the root of this repository and is extended by the individual packages as necessary. For this reason, it is important to run the individual `lint` commands for each package rather than trying to lint the entire repository at once with `eslint .` — this will exclude the nested configurations and produce inconsistent results.

Linting rules (including auto-fixing) are applied to changed files in a pre-commit hook using [Husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged). These are configured in the root `package.json`.

We use [Github Actions](https://docs.github.com/en/free-pro-team@latest/actions) for continuous integration tasks, which include lint checks as well as automated JavaScript tests where applicable.

## Adding new packages

Packages themselves do not have any special requirements under Yarn Workspaces, nor are they required to use the same packages or versions as any other Workspace; just create a new directory, **add it to the `workspaces` list in the root `package.json`**, and then run `yarn init` in your package directory as you normally would. (The entire repo is covered by a GPL V3 license, so make sure your package's `license` field conforms to that.)

Do note that there should only be one `yarn.lock` file for the entire repository; if one is created in your new package directory, you should delete it, make sure the directory is properly listed in the `workspaces` list, and re-run `yarn install`.

ESLint and lint-staged should be installed and applied to your new package directory automatically based on the configurations in the root directory. If you need to extend the default ESLint configuration, create a configuration file in your package directory; if you need to modify or add lint-staged rules, you can do so in the root `package.json`.

In addition, there are some conventions you should follow when setting up your new package, unless you have a compelling and well-documented reason not to:

- The package name should be the same as the directory name
- `yarn dev` should execute the main entry point for development (e.g., starting a development server)
- `yarn lint` should run your static checks (linting, type-checking)
- `yarn test` should run your JS tests, if you have any (which you should!)
