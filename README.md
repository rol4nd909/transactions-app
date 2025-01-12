# Transactions App

## Project Description
The Transactions App is a web application designed to help users manage and track their financial transactions. The frontend displays a list of transactions, and users can click on a transaction to view more details about it. The backend serves the transaction data through a simple Express service.

## Features
- Display a list of transactions
- View detailed information about each transaction

## Implementation Details

### Frontend

The frontend of the application was built using Angular. The main features include:
- Displaying all transactions in a list, grouped by date and ordered with the newest on top.
- Showing only `otherParty.name` and the `amount` in EUR in the transaction list. USD amounts are converted to EUR based on a predefined rate.
- Navigating to a detail page when a transaction is clicked, displaying more in-depth details.
- Basic styling using SCSS for a better user experience.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.7.

#### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

#### Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

#### Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

#### Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

#### Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

### Backend

The backend is a simple Express service that serves a transactions file. The main features include:
- Serving a JSON file containing transaction data.
- Providing two endpoints: 
  - `/` which returns "OK" if the service is running correctly.
  - `/api/transactions` which returns the transactions data in JSON format.

#### Installation

1. Install dependencies:
    ```bash
    npm install
    ```

2. Running the server:
    - Mac: 
        ```bash
        npm run start:mac
        ```
    - Windows: 
        ```bash
        npm run start:windows
        ```

> - This command will run the typescript compiler
> - Copies the transaction.json file to the dist folder
> - Run the express service on port `8080`

#### Endpoints

This service will exist of two endpoints:

- `/` which will say OK if the service is running correctly
- `/api/transactions` which will return a json file with transactions
