# Novabook Tax Service

This service provides accountancy automation capabilities specifically designed for handling sales transactions and tax payment events.

## Features

- Ingest sales and tax payment events.
- Query the tax position for any given date.
- Amend sales events to modify item details.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Dependencies](#development-dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Ingest Transaction](#ingest-transaction)
  - [Query Tax Position](#query-tax-position)
  - [Amend Sale](#amend-sale)
- [Observability](#observability)
- [Testing](#testing)
- [Assumptions](#assumptions)
- [Ambiguities Faced](#ambiguities-faced)
- [Future Work](#future-work)
- [License](#license)

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 14 or higher is recommended. You can download it from [Node.js Official Website](https://nodejs.org/).
- **npm**: This is included with Node.js. Make sure it's installed by running:
  ```bash
  npm -v
  ```

### Development Dependencies

Ensure you install the following for Typescript support and testing

- **TypeScript**: TypeScript compiler.
- **ts-node**: Typescript execution engine.
- **Jest**: Testing framework.

You can install these globally or as development dependencies. To install as development dependencies, run:

```bash
  npm install --save-dev jest ts-node typescript @types/jest
```

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/shahidneki/novabook-tax-service.git
   cd novabook-task-service
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Ther server will be running on http://localhost:3000

### Usage

This service provides a simple API to handle transactions and query tax positions.

### API

#### Ingest Transaction

- Method: `POST`
- Endpoint: `/transactions`
- Request Body:

  - Sale Event:

    ```json
    {
      "eventType": "SALES",
      "date": "2024-02-22T17:29:39Z",
      "invoiceId": "3419027d-960f-4e8f-b8b7-f7b2b4791824",
      "items": [
        {
          "itemId": "02db47b6-fe68-4005-a827-24c6e962f3df",
          "cost": 1099,
          "taxRate": 0.2
        }
      ]
    }
    ```

  - Tax Payment Event:

    ```json
    {
      "eventType": "TAX_PAYMENT",
      "date": "2024-02-22T17:29:39Z",
      "amount": 74901
    }
    ```

- Response:
  - Status 202 Accepted

#### Query Tax Position

- Method: `GET`
- Endpoint: `/tax-position`
- Query Parameters:
  - date (ISO 8601 format, mandatory)
- Response:
  ```json
  {
    "date": "2024-02-22T17:29:39Z",
    "taxPosition": 49
  }
  ```

#### Amend Sale

- Method: `PATCH`
- Endpoint: `/sale`
- Request Body:
  ```json
  {
    "date": "2024-02-22T17:29:39Z",
    "invoiceId": "3419027d-960f-4e8f-b8b7-f7b2b4791824",
    "itemId": "02db47b6-fe68-4005-a827-24c6e962f3df",
    "cost": 798,
    "taxRate": 0.2
  }
  ```
- Response:
  - Status 202 Accepted

### Observability

Basic logging is implemented to track incoming requests, providing visibility into the service's operations. Each request logs the method and endpoint accessed.

### Testing

You can run tests using a testing framework like Jest. The test suite is located in the `tests` directory and can be executed using the following command:

```bash
npx jest
```

### Assumptions

- The service is designed for a single user; multi-tenancy is not supported.
- No authentication is required for API access.
- The service uses in-memory storage for transactions, which means data will not persist across server restarts.
- The tax position accumulates indefinitely, there are no financial years.

### Ambiguities Faced

While implementing the service, the following ambiguities were encountered:

1. Handling Future Dates: The specification mentioned that past or future dates are possible. It was decided to allow transactions with future dates without restrictions.
2. Amendments Without Existing Sales: The service allows amendments to sales events that do not yet exist. This was interpreted as a requirement to accept any ammendment request. If the sale does not exist, it simply stores the amendment.
3. Tax Rate Validity: There was no clear specification on the validity of tax rates (e.g., should it be between 0 and 1). It was decided to allow any tax rate value, but it is recommended to keep it within a certain range.
4. Concurrency: The service currently does not handle concurrent modifications or race conditions, which could be an issue in a more complex application where multiple requests could modify the state simultaneously.

### Future Work

Future enhancements for this service include:

- **Authentication**: Implementing user authentication to secure the API and restrict access to authorized users. This would enhance the service's security and ensure that sensitive financial data is protected.

- **Database Integration**: Transitioning from in-memory storage to a persistent database (e.g., PostgreSQL or MongoDB) to ensure data durability across server restarts. This will allow for better data management, querying capabilities, and scalability.

- **Improved Error Handling**: Implementing more robust error handling and validation mechanisms to ensure data integrity and provide clearer feedback to users.

### License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
