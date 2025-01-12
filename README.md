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

#### Installation

1. Go to the frontend folder
    ```bash
    cd Frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Run the application
    ```bash
    ng serve
    ```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

More information about the frontend you can find in the `/Frontend/README.md`


### Backend

The backend is a simple Express service that serves a transactions file. The main features include:
- Serving a JSON file containing transaction data.
- Providing two endpoints: 
  - `/` which returns "OK" if the service is running correctly.
  - `/api/transactions` which returns the transactions data in JSON format.

#### Installation

1. Go to the backend folder
    ```bash
    cd Backend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Running the server:
    - Mac: 
        ```bash
        npm run start:mac
        ```
    - Windows: 
        ```bash
        npm run start:windows
        ```

#### Endpoints

This service will exist of two endpoints:

- `/` which will say OK if the service is running correctly
- `/api/transactions` which will return a json file with transactions
