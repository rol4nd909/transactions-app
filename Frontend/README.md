# TransactionsApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.7.

## Overview

The TransactionsApp frontend is an Angular application that provides a user interface for viewing financial transactions. It interacts with a backend service to fetch and display transaction data. The application is designed to be responsive and user-friendly, ensuring a seamless experience across different devices.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```


## Frontend Architecture

The frontend application follows a modular architecture, with each feature encapsulated in its own module. Key modules include:

- **Core Module**: Contains singleton services used across the application.
- **Shared Module**: Contains shared components, directives, and pipes.
- **Feature Modules**: Encapsulate specific features of the application, such as transaction management.

## State Management

The application uses Angular's built-in services and RxJS for state management. Services are used to fetch data from the backend and manage the application state. RxJS observables and subjects are used to handle asynchronous data streams and state changes.

## Routing

Angular's RouterModule is used for navigation and routing within the application. Routes are defined for different views and components, enabling deep linking and navigation.

## Styling

The application uses SCSS for styling. Styles are modularized and scoped to components to ensure maintainability and avoid conflicts. Angular's built-in support for view encapsulation is leveraged to apply styles locally to components.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
